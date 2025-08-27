using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Text.Json; // for JsonSerializer

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogisticsFollowupsController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public LogisticsFollowupsController(LogisticsContext context)
        {
            _context = context;
        }
[HttpGet("IntransitData")]
public async Task<ActionResult<IEnumerable<object>>> GetIntransitsWithItems()
{
    var data = await _context.IntransitFollowups
        .Select(f => new 
        {
            f.TransactionId,
            Items = _context.IntransitItemsDetails
                .Where(i => i.TransactionId == f.TransactionId)
                .Select(i => new { i.ItemDescription, i.Uom, quantity = i.RemaningQnty })
                .ToList()
        }).ToListAsync();
     
    return Ok(data);
    
}












// GET: api/logisticsfollowups/with-items
[HttpGet("LogisticsData")]
public async Task<ActionResult<IEnumerable<object>>> GetLogisticsWithItems()
{
    var data = await _context.LogisticsFollowups
        .Select(lf => new 
        {lf.Id,
            lf.TransactionId,
            lf.LoadedOnfcl,
            lf.ContainerType,
            lf.BillNo,
            lf.truckWayBill,
            lf.DocOwner,
            lf.Shipper,
            lf.Transitor,
            lf.Etadjb,
            lf.LoadingDate,
            lf.DjbArrived,
            lf.DocSentDjb,
            lf.DocCollected,
            lf.BillCollected,
            lf.TaxPaid,
            lf.DjbDeparted,
            lf.AkkArrived,
            lf.SdtArrived,
            lf.EmpityContainersLeftUnreturned,
            lf.Origin,
            lf.Remark,
            lf.status,
            Items = _context.logisticsItemsDetails
                .Where(item => item.TransactionId == lf.TransactionId)
                .Select(item => new 
                {
                    item.Id,
                    item.ItemDescription,
                    item.Uom,
               
                    item.LoadedQnty,
                    item.RemaningQnty,
                    item.TotalQnty,
                    item.Date,
                    item.status,
                    item.IntransitId
                })
                .ToList() // ✅ convert IQueryable to List
        })
        .ToListAsync(); // outer ToListAsync

    return Ok(data);
}









[HttpPost("AddLogistics")]
public async Task<ActionResult> AddLogistics([FromBody] LogisticsCreateDto dto)
{
    if (dto == null) return BadRequest("Payload is null.");

    // 1️⃣ Generate a unique TransactionId for this logistics batch
    int maxId = _context.LogisticsFollowups.Any() ? _context.LogisticsFollowups.Max(x => x.Id) : 0;
    string transactionId = $"SLF{maxId + 1}";

    // 2️⃣ Save main logistics info (Origin from first item's IntransitId if exists)
    string origin = string.Empty;
    if (dto.Items != null && dto.Items.Count > 0)
    {
        var firstItemIntransit = await _context.IntransitFollowups
            .FirstOrDefaultAsync(f => f.TransactionId == dto.Items[0].TransactionId);
        if (firstItemIntransit != null)
        {
            origin = firstItemIntransit.Origin ?? string.Empty;
        }
    }

    var logistics = new LogisticsFollowup
    {
        TransactionId = transactionId,
        LoadedOnfcl = dto.LoadedOnfcl,
        EmpityContainersLeftUnreturned = dto.LoadedOnfcl,
        ContainerType = dto.ContainerType,
        Remark = dto.Remark,
        Origin = origin
    };
    _context.LogisticsFollowups.Add(logistics);
    await _context.SaveChangesAsync(); // Save to get ID

    // 3️⃣ Save each logistics item and update in-transit remaining quantity
    foreach (var itemDto in dto.Items)
    {
        decimal loadedQnty = itemDto.Quantity ?? 0;
        decimal totalQnty = itemDto.TotalQuantity ?? 0;
        decimal remainingQnty = totalQnty - loadedQnty;
        if (remainingQnty < 0) remainingQnty = 0;

        // Save the logistics item detail
        var itemDetail = new logisticsItemsDetail
        {
            IntransitId = itemDto.TransactionId,
            TransactionId = transactionId,
            ItemDescription = itemDto.ItemDescription,
            Uom = itemDto.Uom,
            LoadedQnty = loadedQnty,
            TotalQnty = totalQnty,
            RemaningQnty = remainingQnty,
            Date = DateOnly.FromDateTime(DateTime.Now),
        };
        _context.logisticsItemsDetails.Add(itemDetail);

        // ✅ Update the remaining quantity & loaded quantity in the corresponding IntransitItemsDetail
        var intransitItem = await _context.IntransitItemsDetails
            .FirstOrDefaultAsync(i => i.TransactionId == itemDto.TransactionId
                                   && i.ItemDescription == itemDto.ItemDescription);

        if (intransitItem != null)
        {
            intransitItem.LoadedQnty += loadedQnty;      // Accumulate what is loaded
            intransitItem.RemaningQnty = remainingQnty;  // Sync with calculated remaining
        }
    }

    // 4️⃣ Debug log
    Console.WriteLine("=== AddLogistics Payload ===");
    Console.WriteLine(JsonSerializer.Serialize(new { Main = logistics, Items = dto.Items }, new JsonSerializerOptions { WriteIndented = true }));

    // 5️⃣ Save all changes
    await _context.SaveChangesAsync();

    return Ok(new { message = "Logistics saved successfully", transactionId });
}

[HttpPut("logisticsDetail/{id}")]
public async Task<IActionResult> UpdateLogistics(int id, LogisticsCreateDto dto)
{
    var followup = await _context.LogisticsFollowups.FindAsync(id);
    if (followup == null)
        return NotFound($"Logistics followup with ID {id} not found.");

    // ✅ Update main followup fields from top-level DTO
    followup.Remark = dto.Remark;
    followup.BillNo = dto.BillNo;
    followup.truckWayBill = dto.truckWayBill;
    followup.Transitor = dto.Transitor;
    followup.ContainerType = dto.ContainerType;
    followup.LoadedOnfcl = dto.LoadedOnfcl;
    followup.Origin = dto.Origin;
    followup.Shipper = dto.Shipper;

    followup.SdtArrived = dto.SdtArrived;
    followup.AkkArrived = dto.AkkArrived;
    followup.DjbDeparted = dto.DjbDeparted;
    followup.DjbArrived = dto.DjbArrived;
    followup.EmpityContainersLeftUnreturned = dto.EmpityContainersLeftUnreturned;
    followup.BillCollected = dto.BillCollected;
    followup.TaxPaid = dto.TaxPaid;
    followup.DocSentDjb = dto.DocSentDjb;
    followup.DocCollected = dto.DocCollected;
    followup.DocOwner = dto.DocOwner;
    followup.LoadingDate = dto.LoadingDate;
    followup.Etadjb = dto.Etadjb;



    // ✅ Replace items if any exist
            if (dto.Items != null && dto.Items.Any())
            {
                // Remove old items
                var existingItems = _context.logisticsItemsDetails
                    .Where(i => i.TransactionId == followup.TransactionId);
                _context.logisticsItemsDetails.RemoveRange(existingItems);

                // Add new items
                var newItems = dto.Items.Select(it => new logisticsItemsDetail
                {
                    TransactionId = followup.TransactionId,
                    IntransitId = it.IntransitId,
                    ItemDescription = it.ItemDescription,
                    Uom = it.Uom,
                    TotalQnty = it.TotalQnty ?? 0,
                    LoadedQnty = it.LoadedQnty ?? 0,
                    RemaningQnty = (it.TotalQnty ?? 0) - (it.LoadedQnty ?? 0)
                }).ToList();

                _context.logisticsItemsDetails.AddRange(newItems);
            }
            
        
    // ✅ Ensure EF Core tracks this as modified
            _context.Entry(followup).State = EntityState.Modified;

    // ✅ Save changes to the database
    await _context.SaveChangesAsync();

    return NoContent();
}













        private bool LogisticsFollowupExists(int id)
        {
            return _context.LogisticsFollowups.Any(e => e.Id == id);
        }
    }
}
