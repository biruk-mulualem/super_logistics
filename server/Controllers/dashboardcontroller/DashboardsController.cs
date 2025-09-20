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

        [HttpGet("IntransitRelateddata")]
        public async Task<ActionResult<object>> GetPaymentData()
        {
            var data = await _context.IntransitFollowups.ToListAsync();

            // Ensure null values are treated as 0%
            var normalizedData = data.Select(d => new
            {
                TotalRemaningInPercent = d.TotalRemaningInPercent ?? 0m
            }).ToList();

            // Count pending payments (still 100% remaining)
            int pendingPaymentCount = normalizedData.Count(d => d.TotalRemaningInPercent == 100m);

            // Count advance payments (some amount paid but not full)
            int advancePaymentCount = normalizedData.Count(d =>
                d.TotalRemaningInPercent > 0m && d.TotalRemaningInPercent < 100m);

            // Count full payments (no remaining amount)
            int fullPaymentCount = normalizedData.Count(d => d.TotalRemaningInPercent == 0m);

            return Ok(new
            {
                PendingPayment = pendingPaymentCount,
                AdvancePayment = advancePaymentCount,
                FullPayment = fullPaymentCount,
                TotalItems = normalizedData.Count
            });
        }

        [HttpGet("IogisticsRelateddata")]
        public async Task<ActionResult<object>> GetInRouteDjbAakSdt()
        {
            // 1️⃣ InRoute: items loaded but not yet arrived in Djibouti
            var Logistics = await _context.LogisticsFollowups.ToListAsync();
            int inRouteCount = Logistics.Count(f => f.DjbArrived == null);

            // 2️⃣ InDjibouti: arrived but not yet departed
            var djiboutiDepartedIds = await _context.LogisticsDjboutiDeparts
                .Select(d => d.TransactionId)
                .ToListAsync();

            int inDjiboutiCount = Logistics
                .Where(f => f.DjbArrived != null)
                .Count(f => !djiboutiDepartedIds.Contains(f.TransactionId));

            // 3️⃣ InAak: containers currently in AAK but not in SDT
            int inAakCount = await _context.LogisticsArrivedAAks
                .Where(a => !_context.LogisticsArrivedSDTs
                    .Select(s => s.TransactionId)
                    .Contains(a.TransactionId))
                .SumAsync(a => (int?)(a.NumberOfContainer) ?? 0);

            // 4️⃣ InSdt: containers currently in SDT but not yet returned
            var containerReturnedIds = await _context.LogisticsContainerReturns
                .Select(c => c.TransactionId)
                .ToListAsync();

            int inSdtCount = await _context.LogisticsArrivedSDTs
                .Where(s => !containerReturnedIds.Contains(s.TransactionId))
                .SumAsync(s => (int?)(s.NumberOfContainer) ?? 0);

            // 5️⃣ Total Containers
            int totalContainers = await _context.LogisticsFollowups
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            // 6️⃣ DocOwner counts
            var fikaduCount = await _context.LogisticsFollowups
                .CountAsync(f => f.DocOwner == "Fikadu Terefe");

            var shimelisCount = await _context.LogisticsFollowups
                .CountAsync(f => f.DocOwner == "Shimelis Adugna");

            var superCount = await _context.LogisticsFollowups
                .CountAsync(f => f.DocOwner == "Super");

            var othersCount = await _context.LogisticsFollowups
                .CountAsync(f => f.DocOwner == "Others");

            // 7️⃣ Container types
            var total20ft = await _context.LogisticsFollowups
                .Where(f => f.ContainerType == "20ft")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            var total40ft = await _context.LogisticsFollowups
                .Where(f => f.ContainerType == "40ft")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            var total45ftHC = await _context.LogisticsFollowups
                .Where(f => f.ContainerType == "45ft_HC")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            // 8️⃣ Origin counts
            var totalChina = await _context.LogisticsFollowups
                .Where(f => f.Origin == "China")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            var totalIndia = await _context.LogisticsFollowups
                .Where(f => f.Origin == "India")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            var totalUAE = await _context.LogisticsFollowups
                .Where(f => f.Origin == "Uae")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            var totalEgypt = await _context.LogisticsFollowups
                .Where(f => f.Origin == "Egypt")
                .SumAsync(f => (int?)(f.LoadedOnfcl) ?? 0);

            // 9️⃣ Document-related counts
            var billNotCollected = await _context.LogisticsFollowups
                .CountAsync(f => f.BillCollected == null);

            var taxNotPaid = await _context.LogisticsFollowups
                .CountAsync(f => f.TaxPaid == null);

            var docNotCollected = await _context.LogisticsFollowups
                .CountAsync(f => f.DocCollected == null);

            var docNotSentDjb = await _context.LogisticsFollowups
                .CountAsync(f => f.DocSentDjb == null);

            // ✅ Return counts
            return Ok(new
            {
                InRoute = inRouteCount,
                InDjibouti = inDjiboutiCount,
                InAak = inAakCount,
                InSdt = inSdtCount,
                TotalContainers = totalContainers,
                FikaduDocuments = fikaduCount,
                ShimelisDocuments = shimelisCount,
                SuperDocuments = superCount,
                OthersDocuments = othersCount,
                Containers20ft = total20ft,
                Containers40ft = total40ft,
                Containers45ftHC = total45ftHC,
                ContainersFromChina = totalChina,
                ContainersFromIndia = totalIndia,
                ContainersFromUAE = totalUAE,
                ContainersFromEgypt = totalEgypt,
                BillNotCollected = billNotCollected,
                TaxNotPaid = taxNotPaid,
                DocNotCollected = docNotCollected,
                DocNotSentDjb = docNotSentDjb
            });
        }


        [HttpGet("ReminderAndAlerts")]
        public async Task<IActionResult> GetReminderAndAlerts()
        {
            // 🔹 Overpaid POs
            var overpaid = await _context.IntransitFollowups
                .Where(f => f.TotalPaidInPercent > 100)
                .Select(f => $"{f.PurchaseOrder} overpaid, check it out")
                .ToListAsync();

            // 🔹 Fully Paid but Remaining Quantity Unloaded
            var fullyPaid = await _context.IntransitFollowups
                .Where(f => f.TotalPaidInPercent == 100)
                .Select(f => new { f.TransactionId, f.PurchaseOrder })
                .ToListAsync();

            var remainingUnloaded = new List<string>();

            foreach (var record in fullyPaid)
            {
                var relatedItems = await _context.logisticsItemsDetails
                    .Where(l => l.IntransitId == record.TransactionId)
                    .OrderBy(l => l.Id)
                    .ToListAsync();

                if (relatedItems.Any())
                {
                    var lastItem = relatedItems.Last();

                    if ((lastItem.RemaningQnty ?? 0) > 0)
                    {
                        remainingUnloaded.Add(
                            $"{record.PurchaseOrder} full payment done, but {lastItem.RemaningQnty} {lastItem.Uom} remaining unloaded"
                        );
                    }
                }
            }

            // 🔹 ETA Djibouti passed
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var etaEntries = await _context.LogisticsFollowups
                .Where(f => f.Etadjb.HasValue && f.DjbArrived == null && f.Etadjb < today)
                .ToListAsync();

            var etaDjiboutiPassed = etaEntries
                .Select(f =>
                {
                    var daysPassed = today.DayNumber - f.Etadjb!.Value.DayNumber;
                    var dayText = daysPassed == 1 ? "day" : "days";
                    return $"{f.BillNo}'s ETA Djibouti has passed in {daysPassed} {dayText}, check it out";
                })
                .ToList();

            // 🔹 Fetch all LogisticsFollowups that have DjbArrived
            var logisticsData = await _context.LogisticsFollowups
                .Where(f => f.DjbArrived.HasValue)
                .Select(f => new
                {
                    f.TransactionId,
                    f.BillNo,
                    f.DjbArrived,
                    LoadedOnfcl = (int?)(f.LoadedOnfcl) // <-- Make sure this is nullable
                })
                .ToListAsync();

            var inDjiboutiReminders = new List<string>();

            foreach (var item in logisticsData)
            {
                var daysInDjibouti = today.DayNumber - item.DjbArrived!.Value.DayNumber;

                // Sum containers departed
                var departedContainers = await _context.LogisticsDjboutiDeparts
                    .Where(d => d.TransactionId == item.TransactionId)
                    .SumAsync(d => (int?)(d.NumberOfContainer) ?? 0);

                var remainingContainers = (item.LoadedOnfcl ?? 0) - departedContainers;

                if (daysInDjibouti > 6 && remainingContainers > 0)
                {
                    var dayText = daysInDjibouti == 1 ? "day" : "days";
                    inDjiboutiReminders.Add(
                        $"{item.BillNo}: {remainingContainers} container(s) are not departed yet after {daysInDjibouti} {dayText}, check them out"
                    );
                }
            }

            // 🔹 Return all reminders
            return Ok(new
            {
                Overpaid = overpaid,
                FullyPaidButUnloaded = remainingUnloaded,
                EtaDjiboutiPassed = etaDjiboutiPassed,
                ContainersNotDepartedYet = inDjiboutiReminders
            });
        }











    }
}

