using Humanizer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using server.Migrations;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntransitReportController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public IntransitReportController(LogisticsContext context)
        {
            _context = context;
        }

        // GET: api/intransitreport
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetIntransitReports(
            [FromQuery] string? transactionId,
            [FromQuery] string? purchaseOrder,
            [FromQuery] string? origin,
            [FromQuery] string? status,
            [FromQuery] DateOnly? startDate,
            [FromQuery] DateOnly? endDate)
        {
            var query = _context.IntransitFollowups.AsQueryable();

            if (!string.IsNullOrEmpty(transactionId))
                query = query.Where(x => x.TransactionId!.Contains(transactionId));

            if (!string.IsNullOrEmpty(purchaseOrder))
                query = query.Where(x => x.PurchaseOrder!.Contains(purchaseOrder));

            if (!string.IsNullOrEmpty(origin))
                query = query.Where(x => x.Origin!.Contains(origin));

            if (!string.IsNullOrEmpty(status))
            {
                switch (status.ToLower())
                {
                    case "full":
                        query = query.Where(x => x.status == 1);
                        break;
                    case "partial":
                        query = query.Where(x => x.status == null);
                        break;
                    case "cancelled":
                        query = query.Where(x => x.status == 0);
                        break;
                }
            }

            if (startDate.HasValue)
                query = query.Where(x => x.PurchaseDate >= startDate);

            if (endDate.HasValue)
                query = query.Where(x => x.PurchaseDate <= endDate);

            var followups = await query.ToListAsync();

            // Fetch related items and payments for these transactionIds
            var transactionIds = followups.Select(f => f.TransactionId!).ToList();

            var items = await _context.IntransitItemsDetails
                .Where(i => transactionIds.Contains(i.TransactionId!))
                .ToListAsync();

            var payments = await _context.PaymentHistories
                .Where(p => transactionIds.Contains(p.TransactionId!))
                .ToListAsync();

            // Attach items and payments to each followup (anonymous object)
            var result = followups.Select(f => new
            {
                f.Id,
                f.TransactionId,
                f.PurchaseDate,
                f.PurchaseOrder,
                f.PurchaseCompany,
                f.ContactPerson,
                f.TotalPrice,
                f.TotalAmountPaid,
                f.TotalAmountRemaning,
                f.TotalPaidInPercent,
                f.TotalRemaningInPercent,
                f.Grn,
                f.Origin,
                f.Remark,
                Items = items.Where(i => i.TransactionId == f.TransactionId).ToList(),
                Payments = payments.Where(p => p.TransactionId == f.TransactionId).ToList()
            });

            return Ok(result);
        }

        private bool IntransitReportExists(int id)
        {
            return _context.IntransitFollowups.Any(e => e.Id == id);
        }
    }
}
