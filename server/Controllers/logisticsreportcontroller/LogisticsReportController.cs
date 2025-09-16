using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogisticsReportController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public LogisticsReportController(LogisticsContext context)
        {
            _context = context;
        }

        // GET: api/logisticsreport
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetLogisticsReport(
            [FromQuery] string? transactionId,
            [FromQuery] string? billNo,
            [FromQuery] string? shipper,
            [FromQuery] string? transitor,
            [FromQuery] string? origin,
            [FromQuery] string? status,
            [FromQuery] DateOnly? etaStart,
            [FromQuery] DateOnly? etaEnd,
            [FromQuery] string? docOwner)
        {
            // 1️⃣ Base query
            var query = _context.LogisticsFollowups.AsQueryable();

            if (!string.IsNullOrEmpty(transactionId))
                query = query.Where(x => x.TransactionId!.Contains(transactionId));

            if (!string.IsNullOrEmpty(billNo))
                query = query.Where(x => x.BillNo!.Contains(billNo));

            if (!string.IsNullOrEmpty(shipper))
                query = query.Where(x => x.Shipper!.Contains(shipper));

            if (!string.IsNullOrEmpty(transitor))
                query = query.Where(x => x.Transitor!.Contains(transitor));

            if (!string.IsNullOrEmpty(origin))
                query = query.Where(x => x.Origin!.Contains(origin));

            if (!string.IsNullOrEmpty(docOwner))
                query = query.Where(x => x.DocOwner!.Contains(docOwner));

            if (etaStart.HasValue)
                query = query.Where(x => x.Etadjb >= etaStart);

            if (etaEnd.HasValue)
                query = query.Where(x => x.Etadjb <= etaEnd);

            // 2️⃣ Apply status filter
            if (!string.IsNullOrEmpty(status))
            {
                switch (status)
                {
                    case "all_shipments":
                        query = query.Where(x => x.status == 0 || x.status == 1 || x.status == null);
                        break;

                    case "recently_loaded_no_eta":
                        query = query.Where(x => x.Etadjb == null && x.status == null);
                        break;

                    case "arrived_at_djb":
                        query = query.Where(x => x.DjbArrived != null && x.status == null);
                        break;

                    case "not_arrived_at_djb":
                        query = query.Where(x => x.Etadjb != null && x.DjbArrived == null && x.status == null);
                        break;

                    case "dispatched_from_djb_but_not_arrived_aak":
                        query = query.Where(x =>
                            _context.LogisticsDjboutiDeparts.Any(d => d.TransactionId == x.TransactionId) &&
                            !_context.LogisticsArrivedAAks.Any(a => a.TransactionId == x.TransactionId) &&
                            x.status == null);
                        break;

   


                    case "arrived_at_aak":
                        query = query.Where(x =>
                            _context.LogisticsArrivedAAks.Any(a => a.TransactionId == x.TransactionId) &&
                            !_context.LogisticsArrivedSDTs.Any(s => s.TransactionId == x.TransactionId) &&
                            x.status == null);
                        break;

               

                    case "arrived_at_sdt":
                        query = query.Where(x =>
                            _context.LogisticsArrivedSDTs.Any(s => s.TransactionId == x.TransactionId) &&
                            x.status == null);
                        break;

                    case "cancelled_loading":
                        query = query.Where(x => x.status == 0);
                        break;

                    case "container_not_returned":
                        query = query.Where(x =>
                            !_context.LogisticsContainerReturns.Any(c => c.TransactionId == x.TransactionId) &&
                            x.status == null);
                        break;

                    case "tax_paid":
                        query = query.Where(x => x.TaxPaid != null && x.status == null);
                        break;

                    case "tax_not_paid":
                        query = query.Where(x => x.TaxPaid == null && x.status == null);
                        break;

                    default:
                        break;
                }
            }

            // 3️⃣ Execute main query
            var followups = await query.ToListAsync();

            // 4️⃣ Collect TransactionIds
            var transactionIds = followups.Select(f => f.TransactionId!).ToList();

            // 5️⃣ Fetch related tables in bulk
            var items = await _context.logisticsItemsDetails
                .Where(i => transactionIds.Contains(i.TransactionId!))
                .ToListAsync();

            var djbDeparted = await _context.LogisticsDjboutiDeparts
                .Where(d => transactionIds.Contains(d.TransactionId!))
                .ToListAsync();

            var containerReturned = await _context.LogisticsContainerReturns
                .Where(c => transactionIds.Contains(c.TransactionId!))
                .ToListAsync();

            var arrivedAAK = await _context.LogisticsArrivedAAks
                .Where(a => transactionIds.Contains(a.TransactionId!))
                .ToListAsync();

            var arrivedSDT = await _context.LogisticsArrivedSDTs
                .Where(a => transactionIds.Contains(a.TransactionId!))
                .ToListAsync();

            // 6️⃣ Attach related tables to each main record
            var result = followups.Select(f => new
            {
                f.Id,
                f.TransactionId,
                f.BillNo,
                f.Shipper,
                f.Transitor,
                f.Origin,
                f.ContainerType,
                f.Etadjb,
                f.LoadingDate,
                f.DjbArrived,
                f.DocSentDjb,
                f.LoadedOnfcl,
                f.DocCollected,
                f.BillCollected,
                f.TaxPaid,
                f.Remark,
                f.status,
                Items = items.Where(i => i.TransactionId == f.TransactionId).ToList(),
                DJBDeparted = djbDeparted.Where(d => d.TransactionId == f.TransactionId).ToList(),
                ContainerReturned = containerReturned.Where(c => c.TransactionId == f.TransactionId).ToList(),
                ArrivedAAK = arrivedAAK.Where(a => a.TransactionId == f.TransactionId).ToList(),
                ArrivedSDT = arrivedSDT.Where(a => a.TransactionId == f.TransactionId).ToList()
            });

            return Ok(result);
        }

        private bool ReportExists(int id)
        {
            return _context.Reports.Any(e => e.Id == id);
        }
    }
}
