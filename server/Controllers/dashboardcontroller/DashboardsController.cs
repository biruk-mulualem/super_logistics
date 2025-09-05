using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardsController : ControllerBase
    {
        private readonly LogisticsContext _context;
        public DashboardsController(LogisticsContext context)
        {
            _context = context;
        }
        // ===================================================================
        // Fetch all the data from Intransit table and calculate payment stats
        // ===================================================================
        [HttpGet("payment")]
        public async Task<ActionResult<object>> GetPaymentData()
        {
            var data = await _context.IntransitFollowups.ToListAsync();
            // Count pending payments (TotalRemaningInPercent == 100)
            int pendingPaymentCount = data.Count(d => d.TotalRemaningInPercent == 100m);
            // Count advance payments (TotalRemaningInPercent > 0 && < 100)
            int advancePaymentCount = data.Count(d => d.TotalRemaningInPercent > 0m && d.TotalRemaningInPercent < 100m);

            // Count full payments (TotalRemaningInPercent == 100)
            int fullPaymentCount = data.Count(d => d.TotalRemaningInPercent == 0m);
            return Ok(new
            {
                PendingPayment = pendingPaymentCount,
                AdvancePayment = advancePaymentCount,
                FullPayment = fullPaymentCount,
                TotalItems = data.Count
             
            });
        }

              // ===================================================================
        // Fetch all the data from Intransit that did not reach djibouti
        // ===================================================================
[HttpGet("InRouteDjbAakSdt")]
public async Task<ActionResult<object>> GetInRouteDjbAakSdt()
{
    // 1️⃣ InRoute: LogisticsFollowups where DjbArrived is null
    var intransits = await _context.LogisticsFollowups.ToListAsync();
    int inRouteCount = intransits.Count(f => f.DjbArrived == null);

    // 2️⃣ InDjibouti: DjbArrived != null but no record in LogisticsDjboutiDeparts
    var djiboutiDepartedIds = await _context.LogisticsDjboutiDeparts
        .Select(d => d.TransactionId)
        .ToListAsync();

    int inDjiboutiCount = intransits
        .Where(f => f.DjbArrived != null)
        .Count(f => !djiboutiDepartedIds.Contains(f.TransactionId));

    // 3️⃣ InAak: Exists in LogisticsArrivedAAks but not in LogisticsArrivedSDTs
    var arrivedAakIds = await _context.LogisticsArrivedAAks
        .Select(a => a.TransactionId)
        .ToListAsync();

    var arrivedSdtIds = await _context.LogisticsArrivedSDTs
        .Select(s => s.TransactionId)
        .ToListAsync();

    int inAakCount = await _context.LogisticsArrivedAAks
        .Where(a => !arrivedSdtIds.Contains(a.TransactionId))
        .SumAsync(a => a.NumberOfContainer ?? 0);

    // 4️⃣ InSdt: Exists in LogisticsArrivedSDTs but not in LogisticsContainerReturns
    var containerReturnedIds = await _context.LogisticsContainerReturns
        .Select(c => c.TransactionId)
        .ToListAsync();

    int inSdtCount = await _context.LogisticsArrivedSDTs
        .Where(s => !containerReturnedIds.Contains(s.TransactionId))
        .SumAsync(s => s.NumberOfContainer ?? 0);

    // ✅ Return counts
    return Ok(new
    {
        InRoute = inRouteCount,
        InDjibouti = inDjiboutiCount,
        InAak = inAakCount,
        InSdt = inSdtCount
    });
}



    }
}
