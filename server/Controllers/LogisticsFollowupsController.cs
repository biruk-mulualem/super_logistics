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
                .Select(i => new { i.ItemDescription, i.Uom, i.Quantity })
                .ToList()
        }).ToListAsync();
     
    return Ok(data);
    
}




 









[HttpPost("AddLogistics")]
public async Task<ActionResult> AddLogistics([FromBody] LogisticsCreateDto dto)
{
    if (dto == null) return BadRequest("Payload is null.");

    // 1️⃣ Generate a unique TransactionId for this logistics batch
    int maxId = _context.LogisticsFollowups.Any() ? _context.LogisticsFollowups.Max(x => x.Id) : 0;
    string transactionId = $"SLF{maxId + 1}";

    // 2️⃣ Save main logistics info
    var logistics = new LogisticsFollowup
    {
        TransactionId = transactionId,
        LoadedOnfcl = dto.LoadedOnfcl,
        ContainerType = dto.ContainerType,
        Remark = dto.Remark,
        Origin = dto.Origin
    };
    _context.LogisticsFollowups.Add(logistics);
    await _context.SaveChangesAsync(); // Save to get Id

    // 3️⃣ Save each item to the detail table
    foreach (var itemDto in dto.Items)
    {
        var itemDetail = new logisticsItemsDetail
        {
            IntransitId = itemDto.TransactionId,          // from payload
            TransactionId = transactionId,                // main logistics transactionId
            ItemDescription = itemDto.ItemDescription,
            Uom = itemDto.Uom,
            LoadedQnty = itemDto.Quantity,               // loaded quantity
            TotalQnty = itemDto.TotalQuantity,          // original quantity
            RemaningQnty = itemDto.TotalQuantity - itemDto.Quantity,
            Date = DateOnly.FromDateTime(DateTime.Now),
        };
        _context.logisticsItemsDetails.Add(itemDetail);
    }

    // 4️⃣ Console log for debugging
    Console.WriteLine("=== AddLogistics Payload ===");
    Console.WriteLine(JsonSerializer.Serialize(new { Main = logistics, Items = dto.Items }, new JsonSerializerOptions { WriteIndented = true }));

    await _context.SaveChangesAsync();

    return Ok(new { message = "Logistics saved successfully", transactionId });
}







        private bool LogisticsFollowupExists(int id)
        {
            return _context.LogisticsFollowups.Any(e => e.Id == id);
        }
    }
}
