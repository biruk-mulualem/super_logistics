using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Text.Json; // for JsonSerializer
using server.Models;


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


// =======================================================
// Fetch in-transit data to be used in logistics
// This endpoint retrieves all in-transit follow-ups along with their items
// Only items with remaining quantity (RemaningQnty != 0) are included
// =======================================================
[HttpGet("IntransitData")]
public async Task<ActionResult<IEnumerable<object>>> GetIntransitsWithItems()
{
    var data = await _context.IntransitFollowups
        .Select(f => new 
        {
            f.TransactionId,
            Items = _context.IntransitItemsDetails
                .Where(i => i.TransactionId == f.TransactionId && i.RemaningQnty != 0)
                .Select(i => new 
                { 
                    i.ItemDescription, 
                    i.Uom, 
                    quantity = i.RemaningQnty 
                })
                .ToList()
        })
        .ToListAsync();

    return Ok(data);    
}

// ====================status0===================================
// Get all logistics data with status 0
// This endpoint retrieves all logistics follow-ups marked as inactive (status 0)
// along with their related items, departures, arrivals, and returned containers
// =======================================================
[HttpGet("status0")]
public async Task<ActionResult<IEnumerable<object>>> GetStatus0()
{
    var data = await _context.LogisticsFollowups
        .Where(x => x.status == 0)
        .ToListAsync();

    var results = new List<object>();

    foreach (var row in data)
    {
        var transactionId = row.TransactionId;

        var items = await _context.logisticsItemsDetails
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var djbDeparted = await _context.LogisticsDjboutiDeparts
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var arrivedAAk = await _context.LogisticsArrivedAAks
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var arrivedSDT = await _context.LogisticsArrivedSDTs
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var containerReturned = await _context.LogisticsContainerReturns
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        results.Add(new
        {
            row.Id,
            row.TransactionId,
            row.LoadedOnfcl,
            row.ContainerType,
            row.BillNo,
            row.truckWayBill,
            row.DocOwner,
            row.Shipper,
            row.Transitor,
            row.Etadjb,
            row.LoadingDate,
            row.DjbArrived,
            row.DocSentDjb,
            row.DocCollected,
            row.BillCollected,
            row.TaxPaid,
            row.Origin,
            row.Remark,
            row.status,
            items,
            djbDeparted,
            arrivedAAk,
            arrivedSDT,
            containerReturned
        });
    }

    return Ok(results);
}
// =================status0======================================
// Get all logistics items details for a given TransactionId with status 0
// This endpoint retrieves all items linked to a specific transaction
// =======================================================
[HttpGet("status0/{transactionId}")]
public async Task<ActionResult<IEnumerable<logisticsItemsDetail>>> GetItemDetailstatus0ByTransactionId(string transactionId)
{
    var itemsDetail = await _context.logisticsItemsDetails
        .Where(p => p.TransactionId == transactionId)
        .ToListAsync();
    return Ok(itemsDetail);
}
// ===============status1========================================
// Get all logistics followups with status 1
// This endpoint retrieves all logistics entries where status == 1
// and includes related details such as items, departures, arrivals, and returned containers.
// =======================================================
[HttpGet("status1")]
public async Task<ActionResult<IEnumerable<object>>> GetStatus1()
{
    var data = await _context.LogisticsFollowups
        .Where(x => x.status == 1)
        .ToListAsync();

    var results = new List<object>();

    foreach (var row in data)
    {
        var transactionId = row.TransactionId;

        var items = await _context.logisticsItemsDetails
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var djbDeparted = await _context.LogisticsDjboutiDeparts
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var arrivedAAk = await _context.LogisticsArrivedAAks
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var arrivedSDT = await _context.LogisticsArrivedSDTs
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        var containerReturned = await _context.LogisticsContainerReturns
            .Where(p => p.TransactionId == transactionId)
            .ToListAsync();

        results.Add(new
        {
            row.Id,
            row.TransactionId,
            row.LoadedOnfcl,
            row.ContainerType,
            row.BillNo,
            row.truckWayBill,
            row.DocOwner,
            row.Shipper,
            row.Transitor,
            row.Etadjb,
            row.LoadingDate,
            row.DjbArrived,
            row.DocSentDjb,
            row.DocCollected,
            row.BillCollected,
            row.TaxPaid,
            row.Origin,
            row.Remark,
            row.status,
            items,
            djbDeparted,
            arrivedAAk,
            arrivedSDT,
            containerReturned
        });
    }

    return Ok(results);
}
// ===============status1========================================
// Get all logistics items for a specific transaction (status 1)
// This endpoint fetches all items from logisticsItemsDetails
// that belong to the given transactionId where the parent
// LogisticsFollowup has status = 1.
// =======================================================
[HttpGet("status1/{transactionId}")]
public async Task<ActionResult<IEnumerable<logisticsItemsDetail>>> GetItemDetailstatus1ByTransactionId(string transactionId)
{
    var itemsDetail = await _context.logisticsItemsDetails
        .Where(p => p.TransactionId == transactionId)
        .ToListAsync();
    return Ok(itemsDetail);
}
// =================== LogisticsData=======================
// Get all the logistics data along with related details
// This endpoint fetches all LogisticsFollowups where status
// is not 0 or 1, including their items, Djibouti departures,
// arrivals at AAK and SDT, and returned containers.
// =======================================================
[HttpGet("LogisticsData")]
public async Task<ActionResult<IEnumerable<object>>> GetLogisticsWithItems()
{
    var data = await _context.LogisticsFollowups
            .Where(lf => lf.status != 0 && lf.status != 1)
        .Select(lf => new 
        {
            lf.Id,
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
            lf.Origin,
            lf.Remark,
            lf.status, 

            // ✅ Items
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
                .ToList(),

            // ✅ Arrived at AAK
            ArrivedAAk = _context.LogisticsArrivedAAks
                .Where(a => a.TransactionId == lf.TransactionId)
                .Select(a => new 
                {
                    a.Id,
                    a.TransactionId,
                    a.NumberOfContainer,
                    a.Date,
                    a.Remark
                })
                .ToList(),

            // ✅ Arrived at SDT
            ArrivedSDT = _context.LogisticsArrivedSDTs
                .Where(s => s.TransactionId == lf.TransactionId)
                .Select(s => new 
                {
                    s.Id,
                    s.TransactionId,
                    s.NumberOfContainer,
                    s.Date,
                    s.Remark
                })
                .ToList(),

            // ✅ Containers Returned
            ContainerReturned = _context.LogisticsContainerReturns
                .Where(c => c.TransactionId == lf.TransactionId)
                .Select(c => new 
                {
                    c.Id,
                    c.TransactionId,
                    c.NumberOfContainer,
                    c.Date,
                    c.Remark
                })
                .ToList(),

            // ✅ Departed from Djibouti
            DjbDeparted = _context.LogisticsDjboutiDeparts
                .Where(d => d.TransactionId == lf.TransactionId)
                .Select(d => new 
                {
                    d.Id,
                    d.TransactionId,
                    d.NumberOfContainer,
                    d.Date,
                    d.Remark
                })
                .ToList()
        })
        .ToListAsync();

    return Ok(data);
}

// ==================AddLogistics=========================
// Add a new item to the logistics follow-up
// This endpoint creates a new logistics follow-up entry,
// generates a unique TransactionId, saves the main logistics
// info, adds all items provided in the DTO, updates the
// corresponding in-transit item quantities, and logs debug info.
// =======================================================

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
    Console.WriteLine(JsonSerializer.Serialize(
        new { Main = logistics, Items = dto.Items },
        new JsonSerializerOptions { WriteIndented = true }
    ));

    // 5️⃣ Save all changes
    await _context.SaveChangesAsync();

    return Ok(new { message = "Logistics saved successfully", transactionId });
}
// ===================logisticsDetail=====================
// Update LogisticsFollowups and related items/rows
// - Updates main followup fields
// - Updates logisticsItemsDetails and IntransitItemsDetails
// - Updates DJB Departed, AAK Arrived, SDT Arrived, Containers Returned
// - Calculates totals and updates status if all containers match LoadedOnfcl
// =======================================================
[HttpPut("logisticsDetail/{id}")]
public async Task<IActionResult> UpdateLogistics(int id, LogisticsCreateDto dto)
{
    var followup = await _context.LogisticsFollowups.FindAsync(id);
    if (followup == null)
        return NotFound($"Logistics followup with ID {id} not found.");

    // ================== Main followup fields ==================
    followup.Remark = dto.Remark;
    followup.BillNo = dto.BillNo;
    followup.truckWayBill = dto.truckWayBill;
    followup.Transitor = dto.Transitor;
    followup.ContainerType = dto.ContainerType;
    followup.LoadedOnfcl = dto.LoadedOnfcl;
    followup.Origin = dto.Origin;
    followup.Shipper = dto.Shipper;
    followup.DjbArrived = dto.DjbArrived;
    followup.BillCollected = dto.BillCollected;
    followup.TaxPaid = dto.TaxPaid;
    followup.DocSentDjb = dto.DocSentDjb;
    followup.DocCollected = dto.DocCollected;
    followup.DocOwner = dto.DocOwner;
    followup.LoadingDate = dto.LoadingDate;
    followup.Etadjb = dto.Etadjb;

    // ================== Items ==================
    if (dto.Items != null && dto.Items.Any())
    {
        // ===============================
        // 🚚 Fetch existing logistics items
        // ===============================
        var existingItems = _context.logisticsItemsDetails
            .Where(i => i.TransactionId == followup.TransactionId)
            .ToList();

        // ===============================
        // 🚚 Update logisticsItemsDetails
        // ===============================
        _context.logisticsItemsDetails.RemoveRange(existingItems);

        var newLogisticsItems = dto.Items.Select(it =>
        {
            // Get the IntransitId from existing item if available
            var matched = existingItems
                .FirstOrDefault(x => x.TransactionId == followup.TransactionId
                                  && x.ItemDescription == it.ItemDescription);

            var db_intransitId = matched?.IntransitId;
            var db_itemDescription = matched?.ItemDescription;

            return new logisticsItemsDetail
            {
                TransactionId = followup.TransactionId,
                IntransitId = db_intransitId ?? it.IntransitId,
                ItemDescription = db_itemDescription ?? it.ItemDescription,
                Uom = it.Uom,
                TotalQnty = it.TotalQnty ?? 0,
                LoadedQnty = it.LoadedQnty ?? 0,
                Date = DateOnly.FromDateTime(DateTime.Now),
                RemaningQnty = (it.TotalQnty ?? 0) - (it.LoadedQnty ?? 0)
            };
        }).ToList();

        _context.logisticsItemsDetails.AddRange(newLogisticsItems);

        // ==================================
        // 📦 Update IntransitItemsDetails
        // ==================================
        foreach (var it in dto.Items)
        {
            var matched = existingItems
                .FirstOrDefault(x => x.TransactionId == followup.TransactionId
                                  && x.ItemDescription == it.ItemDescription);

            var db_intransitId = matched?.IntransitId;
            var db_itemDescription = matched?.ItemDescription;

            if (!string.IsNullOrEmpty(db_intransitId) && !string.IsNullOrEmpty(db_itemDescription))
            {
                var intransitItem = _context.IntransitItemsDetails
                    .FirstOrDefault(x => x.TransactionId == db_intransitId
                                      && x.ItemDescription == db_itemDescription);

                if (intransitItem != null)
                {
                    intransitItem.LoadedQnty = it.LoadedQnty ?? 0;
                    intransitItem.RemaningQnty = (it.TotalQnty ?? 0) - (it.LoadedQnty ?? 0);
                }
            }
        }

        // ✅ Save all changes at once
        _context.SaveChanges();
    }

    // ================== DJB Departed Rows ==================
    if (dto.DjbDepartedRows != null)
    {
        var oldDjbRows = _context.LogisticsDjboutiDeparts
            .Where(r => r.TransactionId == followup.TransactionId);
        _context.LogisticsDjboutiDeparts.RemoveRange(oldDjbRows);

        var newDjbRows = dto.DjbDepartedRows.Select(r => new LogisticsDjboutiDeparted
        {
            TransactionId = followup.TransactionId,
            NumberOfContainer = r.NumberOfContainer,
            Remark = r.Remark,
            Date = r.Date
        }).ToList();

        _context.LogisticsDjboutiDeparts.AddRange(newDjbRows);
    }

    // ================== AAK Arrived Rows ==================
    if (dto.AakArrivedRows != null)
    {
        var oldAakRows = _context.LogisticsArrivedAAks
            .Where(r => r.TransactionId == followup.TransactionId);
        _context.LogisticsArrivedAAks.RemoveRange(oldAakRows);

        var newAakRows = dto.AakArrivedRows.Select(r => new LogisticsArrivedAAk
        {
            TransactionId = followup.TransactionId,
            NumberOfContainer = r.NumberOfContainer,
            Remark = r.Remark,
            Date = r.Date
        }).ToList();

        _context.LogisticsArrivedAAks.AddRange(newAakRows);
    }

    // ================== SDT Arrived Rows ==================
    if (dto.SdtArrivedRows != null)
    {
        var oldSdtRows = _context.LogisticsArrivedSDTs
            .Where(r => r.TransactionId == followup.TransactionId);
        _context.LogisticsArrivedSDTs.RemoveRange(oldSdtRows);

        var newSdtRows = dto.SdtArrivedRows.Select(r => new LogisticsArrivedSDT
        {
            TransactionId = followup.TransactionId,
            NumberOfContainer = r.NumberOfContainer,
            Remark = r.Remark,
            Date = r.Date
        }).ToList();

        _context.LogisticsArrivedSDTs.AddRange(newSdtRows);
    }

    // ================== Containers Returned Rows ==================
    if (dto.ContainersReturnedRows != null)
    {
        var oldReturnedRows = _context.LogisticsContainerReturns
            .Where(r => r.TransactionId == followup.TransactionId);
        _context.LogisticsContainerReturns.RemoveRange(oldReturnedRows);

        var newReturnedRows = dto.ContainersReturnedRows.Select(r => new LogisticsContainerReturned
        {
            TransactionId = followup.TransactionId,
            NumberOfContainer = r.NumberOfContainer,
            Remark = r.Remark,
            Date = r.Date
        }).ToList();

        _context.LogisticsContainerReturns.AddRange(newReturnedRows);
    }

    // ================== Container & SDT Comparison ==================
    // 1️⃣ Total NumberOfContainer for SDT
    int totalSdtContainers = dto.SdtArrivedRows != null ? dto.SdtArrivedRows.Sum(r => r.NumberOfContainer ?? 0) : 0;
    Console.WriteLine($"[DEBUG] Total SDT Containers: New={totalSdtContainers}, Total={totalSdtContainers}");

    // 2️⃣ Total NumberOfContainer for ContainersReturned
    int totalReturnedContainers = dto.ContainersReturnedRows != null ? dto.ContainersReturnedRows.Sum(r => r.NumberOfContainer ?? 0) : 0;
    Console.WriteLine($"[DEBUG] Total Returned Containers: New={totalReturnedContainers}, Total={totalReturnedContainers}");

    // 3️⃣ Compare with LoadedOnfcl
    Console.WriteLine($"[DEBUG] LoadedOnfcl: {followup.LoadedOnfcl}");
    if (totalSdtContainers == followup.LoadedOnfcl && totalReturnedContainers == followup.LoadedOnfcl)
    {
        Console.WriteLine($"[DEBUG] All containers match LoadedOnfcl. Updating LogisticsFollowups where TransactionId={followup.TransactionId} status to 1.");
        var logisticsFollowups = await _context.LogisticsFollowups
            .FirstOrDefaultAsync(f => f.TransactionId == followup.TransactionId);

        if (logisticsFollowups != null)
        {
            logisticsFollowups.status = 1;
            _context.LogisticsFollowups.Update(logisticsFollowups);
        }
    }
    else
    {
        Console.WriteLine($"[DEBUG] Containers do not match LoadedOnfcl. SDT={totalSdtContainers}, Returned={totalReturnedContainers}, LoadedOnfcl={followup.LoadedOnfcl}");
    }

    _context.Entry(followup).State = EntityState.Modified;
    await _context.SaveChangesAsync();

    return NoContent();
}

// =====================logisticsDeleteDetail==============
// Soft delete / cancel a logistics followup item
// - Sets the status of the followup to 0
// - Does not remove the record from the database
// =======================================================

[HttpDelete("logisticsDeleteDetail/{id}")]
public async Task<IActionResult> UpdateStatusToZero(int id)
{
    var followup = await _context.LogisticsFollowups.FindAsync(id);
    if (followup == null) return NotFound();
    followup.status = 0; // string, not number
    _context.LogisticsFollowups.Update(followup);
    await _context.SaveChangesAsync();
return Ok(new { message = $"Status updated to 0 for ID {id}" });
}

        // =======================================================
        // helper method
        // ======================================================
        private bool LogisticsFollowupExists(int id)
        {
            return _context.LogisticsFollowups.Any(e => e.Id == id);
        }
    }
}


