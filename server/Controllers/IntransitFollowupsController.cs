using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntransitFollowupsController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public IntransitFollowupsController(LogisticsContext context)
        {
            _context = context;
        }

        // ===========================
        // GET: Intransit by Status
        // ===========================
        [HttpGet("status0")]
        public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetStatus0()
        {
            var data = await _context.IntransitFollowups
                .Where(x => x.status == 0)
                .ToListAsync();
            return Ok(data);
        }

        [HttpGet("status0/{transactionId}")]
        public async Task<ActionResult<IEnumerable<IntransitItemsDetail>>> GetItemDetailstatus0ByTransactionId(string transactionId)
        {
            var itemsDetail = await _context.IntransitItemsDetails
                .Where(p => p.TransactionId == transactionId)
                .ToListAsync();
            return Ok(itemsDetail);
        }

        [HttpGet("status1")]
        public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetStatus1()
        {
            var data = await _context.IntransitFollowups
                .Where(x => x.status == 1)
                .ToListAsync();
            return Ok(data);
        }

        [HttpGet("status1/{transactionId}")]
        public async Task<ActionResult<IEnumerable<IntransitItemsDetail>>> GetItemDetailstatus1ByTransactionId(string transactionId)
        {
            var itemsDetail = await _context.IntransitItemsDetails
                .Where(p => p.TransactionId == transactionId)
                .ToListAsync();
            return Ok(itemsDetail);
        }

        [HttpGet("statusOther")]
        public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetStatusOther()
        {
            var data = await _context.IntransitFollowups
                .Where(x => x.status != 0 && x.status != 1)
                .ToListAsync();
            return Ok(data);
        }

        [HttpGet("statusOther/{transactionId}")]
        public async Task<ActionResult<IEnumerable<IntransitItemsDetail>>> GetItemDetailstatusOtherByTransactionId(string transactionId)
        {
            var itemsDetail = await _context.IntransitItemsDetails
                .Where(p => p.TransactionId == transactionId)
                .ToListAsync();
            return Ok(itemsDetail);
        }

        // ===========================
        // GET: Payments by Transaction
        // ===========================
        [HttpGet("payment/{transactionId}")]
        public async Task<ActionResult<IEnumerable<PaymentHistory>>> GetPaymentsByTransactionId(string transactionId)
        {
            var payments = await _context.PaymentHistories
                .Where(p => p.TransactionId == transactionId)
                .ToListAsync();
            return Ok(payments);
        }

        // ===========================
        // GET: Intransit by ID
        // ===========================
        [HttpGet("{id}")]
        public async Task<ActionResult<IntransitFollowup>> GetById(int id)
        {
            var followup = await _context.IntransitFollowups.FindAsync(id);
            if (followup == null) return NotFound();
            return followup;
        }

        // ===========================
        // POST: Create Intransit Entry
        // ===========================
        [HttpPost("intransit")]
        public async Task<ActionResult<IntransitFollowup>> Create([FromBody] IntransitCreateDto dto)
        {
            if (dto == null)
                return BadRequest("Payload is required.");

            // Generate unique TransactionId
            var lastTransaction = await _context.IntransitFollowups
                .AsNoTracking()
                .OrderByDescending(f => f.Id)
                .FirstOrDefaultAsync();

            int nextNumber = 1;
            if (lastTransaction != null && !string.IsNullOrEmpty(lastTransaction.TransactionId))
            {
                var numericPart = lastTransaction.TransactionId.Substring(3);
                if (int.TryParse(numericPart, out int lastNumber))
                    nextNumber = lastNumber + 1;
            }

            string transactionId = $"SDT{nextNumber.ToString().PadLeft(6, '0')}";

            // --- Calculate total price from items ---
            decimal totalPrice = dto.Items?.Sum(it => it.Quantity * it.UnitPrice) ?? 0;

            // --- Map DTO to IntransitFollowup ---
            var followup = new IntransitFollowup
            {
                TransactionId = transactionId,
                PurchaseDate = dto.PurchaseDate,
                PurchaseOrder = dto.PurchaseOrder,
                PurchaseCompany = dto.PurchaseCompany,
                ContactPerson = dto.ContactPerson,
                Origin = dto.Origin,
                Remark = dto.Remark,
                TotalPrice = totalPrice,
                TotalAmountPaid = 0,
                TotalAmountRemaning = totalPrice,
                TotalPaidInPercent = 0,
                TotalRemaningInPercent = 100,
                status = null
            };

            _context.IntransitFollowups.Add(followup);
            await _context.SaveChangesAsync();

            // --- Map items DTO to IntransitItemsDetail ---
            if (dto.Items != null && dto.Items.Any())
            {
                var items = dto.Items.Select(it => new IntransitItemsDetail
                {
                    TransactionId = transactionId,
                    ItemDescription = it.ItemDescription,
                    Quantity = it.Quantity,
                    UnitPrice = it.UnitPrice,
                    Uom = it.Uom
                }).ToList();

                _context.IntransitItemsDetails.AddRange(items);
                await _context.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(GetById), new { id = followup.Id }, followup);
        }

        // ===========================
        // POST: Add Payment(s)
        // ===========================
        [HttpPost("payment")]
        public async Task<ActionResult> CreatePayment([FromBody] List<PaymentHistory> payments)
        {
            if (payments == null || !payments.Any())
                return BadRequest("Payment data is required.");

            _context.PaymentHistories.AddRange(payments);
            await _context.SaveChangesAsync();

            // Update totals
            var transactionGroups = payments.GroupBy(p => p.TransactionId);
            foreach (var group in transactionGroups)
            {
                var transactionId = group.Key?.Trim();
                if (string.IsNullOrEmpty(transactionId)) continue;

                var totalPaid = await _context.PaymentHistories
                    .Where(p => p.TransactionId == transactionId)
                    .SumAsync(p => p.AmountPaid);

                var intransitEntry = await _context.IntransitFollowups
                    .FirstOrDefaultAsync(i => i.TransactionId.Trim() == transactionId);

                if (intransitEntry != null)
                {
                    intransitEntry.TotalAmountPaid = totalPaid;
                    intransitEntry.TotalAmountRemaning = intransitEntry.TotalPrice - totalPaid;

                    if (intransitEntry.TotalAmountRemaning == 0)
                        intransitEntry.status = 1;

                    intransitEntry.TotalPaidInPercent = intransitEntry.TotalPrice == 0
                        ? 0
                        : (totalPaid / intransitEntry.TotalPrice) * 100;

                    intransitEntry.TotalRemaningInPercent = intransitEntry.TotalPrice == 0
                        ? 0
                        : (intransitEntry.TotalAmountRemaning / intransitEntry.TotalPrice) * 100;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(payments);
        }

        // ===========================
        // PUT: Update Intransit Entry
        // ===========================
//       [HttpPut("intransit/{id}")]
// public async Task<IActionResult> UpdateIntransit(int id, IntransitCreateDto dto)
// {
//     // 1️⃣ Find the main followup
//     var followup = await _context.IntransitFollowups.FindAsync(id);
//     if (followup == null)
//         return NotFound($"Followup with ID {id} not found.");

//     // 2️⃣ Update main fields
//     followup.PurchaseDate = dto.PurchaseDate;
//     followup.PurchaseOrder = dto.PurchaseOrder;
//     followup.PurchaseCompany = dto.PurchaseCompany;
//     followup.ContactPerson = dto.ContactPerson;
//     followup.Origin = dto.Origin;
//     followup.Remark = dto.Remark;
//     followup.Grn = dto.Grn;   // 👈 Add this line

//     // 3️⃣ Update items table
//     if (dto.Items != null && dto.Items.Any())
//     {
//         //  in IntransitItemsDetails table i added two column RemaningQnty,LoadedQnty and whenver i insert an item data i need to add a feature when i inser into intransit the loading qnty is 0 and the remeaning qnty is eqult to the qnty 
//         var existingItems = _context.IntransitItemsDetails
//                                     .Where(i => i.TransactionId == followup.TransactionId);
//         _context.IntransitItemsDetails.RemoveRange(existingItems);

//         // Add new/updated items
//         var newItems = dto.Items.Select(it => new IntransitItemsDetail
//         {
//             TransactionId = followup.TransactionId,
//             ItemDescription = it.ItemDescription,
//             Quantity = it.Quantity,
//             Uom = it.Uom,
//             UnitPrice = it.UnitPrice
//         }).ToList();

//         _context.IntransitItemsDetails.AddRange(newItems);
//     }

//     // 4️⃣ Recalculate totals based on updated items
//     followup.TotalPrice = dto.Items?.Sum(i => i.Quantity * i.UnitPrice) ?? 0;

//     followup.TotalAmountPaid ??= 0;
//     followup.TotalAmountRemaning = followup.TotalPrice - followup.TotalAmountPaid.Value;
//     followup.TotalPaidInPercent = followup.TotalPrice == 0
//         ? 0
//         : (followup.TotalAmountPaid.Value / followup.TotalPrice) * 100;
//     followup.TotalRemaningInPercent = followup.TotalPrice == 0
//         ? 0
//         : (followup.TotalAmountRemaning / followup.TotalPrice) * 100;

//     // 5️⃣ Save changes
//     await _context.SaveChangesAsync();

//     return NoContent();
// }






[HttpPut("intransit/{id}")]
public async Task<IActionResult> UpdateIntransit(int id, IntransitCreateDto dto)
{
    // 1️⃣ Find the main followup
    var followup = await _context.IntransitFollowups.FindAsync(id);
    if (followup == null)
        return NotFound($"Followup with ID {id} not found.");

    // 2️⃣ Update main fields
    followup.PurchaseDate = dto.PurchaseDate;
    followup.PurchaseOrder = dto.PurchaseOrder;
    followup.PurchaseCompany = dto.PurchaseCompany;
    followup.ContactPerson = dto.ContactPerson;
    followup.Origin = dto.Origin;
    followup.Remark = dto.Remark;
    followup.Grn = dto.Grn; //  Existing field update

    //  Update items table
    if (dto.Items != null && dto.Items.Any())
    {
        // Remove existing items for this transaction
        var existingItems = _context.IntransitItemsDetails
                                    .Where(i => i.TransactionId == followup.TransactionId);
        _context.IntransitItemsDetails.RemoveRange(existingItems);

        // Add new/updated items with LoadedQnty = 0, RemainingQnty = Quantity
        var newItems = dto.Items.Select(it => new IntransitItemsDetail
        {
            TransactionId = followup.TransactionId,
            ItemDescription = it.ItemDescription,
            Quantity = it.Quantity,
            Uom = it.Uom,
            UnitPrice = it.UnitPrice,
            LoadedQnty = 0,              // Initially 0
            RemaningQnty = it.Quantity  // Initially equal to Quantity
        }).ToList();

        _context.IntransitItemsDetails.AddRange(newItems);
    }

    // 4️⃣ Recalculate totals based on updated items
    followup.TotalPrice = dto.Items?.Sum(i => i.Quantity * i.UnitPrice) ?? 0;

    followup.TotalAmountPaid ??= 0;
    followup.TotalAmountRemaning = followup.TotalPrice - followup.TotalAmountPaid.Value;
    followup.TotalPaidInPercent = followup.TotalPrice == 0
        ? 0
        : (followup.TotalAmountPaid.Value / followup.TotalPrice) * 100;
    followup.TotalRemaningInPercent = followup.TotalPrice == 0
        ? 0
        : (followup.TotalAmountRemaning / followup.TotalPrice) * 100;

    // 5️⃣ Save changes
    await _context.SaveChangesAsync();

    return NoContent();
}


[HttpPut("payment/{id}")]
public async Task<IActionResult> UpdatePayment(int id, [FromBody] PaymentUpdateDto dto)
{
    var followup = await _context.IntransitFollowups.FindAsync(id);
    if (followup == null)
        return NotFound($"Followup with ID {id} not found.");

    // Remove existing payments for this transaction
    var existingPayments = _context.PaymentHistories
                                   .Where(p => p.TransactionId == followup.TransactionId);
    _context.PaymentHistories.RemoveRange(existingPayments);

    // Prepare new payments list
    List<PaymentHistory> newPayments = new();

    if (dto.Payments != null && dto.Payments.Any())
    {
        newPayments = dto.Payments.Select(p => new PaymentHistory
        {
            TransactionId = followup.TransactionId,
            AmountPaid = p.AmountPaid,
            PaidBy = p.PaidBy,
            AccountPaidFrom = p.AccountPaidFrom,
            PaidDate = p.PaidDate
        }).ToList();

        _context.PaymentHistories.AddRange(newPayments);
    }

    // Calculate totals from new payments (not from DB)
    decimal totalPaid = newPayments.Sum(p => p.AmountPaid);
    followup.TotalAmountPaid = totalPaid;
    followup.TotalAmountRemaning = followup.TotalPrice - totalPaid;

    followup.TotalPaidInPercent = followup.TotalPrice == 0
        ? 0
        : (totalPaid / followup.TotalPrice) * 100;

    followup.TotalRemaningInPercent = followup.TotalPrice == 0
        ? 0
        : (followup.TotalAmountRemaning / followup.TotalPrice) * 100;

    // Update status if fully paid
    if (followup.TotalAmountRemaning == 0)
    {
        followup.status = 1;
    }

    await _context.SaveChangesAsync();

    return NoContent();
}




        // ===========================
        // DELETE: Soft delete followup
        // ===========================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var followup = await _context.IntransitFollowups.FindAsync(id);
            if (followup == null) return NotFound();

            followup.status = 0;
            _context.IntransitFollowups.Update(followup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ===========================
        // Helper Method
        // ===========================
        private bool FollowupExists(int id) => _context.IntransitFollowups.Any(e => e.Id == id);
    }
}
