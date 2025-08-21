using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

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

 // GET /api/IntransitFollowups/status0
[HttpGet("status0")]
public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetStatus0()
{
    var data = await _context.IntransitFollowups
        .Where(x => x.status == 0)
        .ToListAsync();
    return Ok(data);
}

// GET /api/IntransitFollowups/status1
[HttpGet("status1")]
public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetStatus1()
{
    var data = await _context.IntransitFollowups
        .Where(x => x.status == 1)
        .ToListAsync();
    return Ok(data);
}

// GET /api/IntransitFollowups/statusOther
[HttpGet("statusOther")]
public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetStatusOther()
{
    var data = await _context.IntransitFollowups
        .Where(x => x.status != 0 && x.status != 1)
        .ToListAsync();
    return Ok(data);
}


           // GET: api/IntransitFollowups
[HttpGet("payment/{transactionId}")]
public async Task<ActionResult<IEnumerable<PaymentHistory>>> GetPaymentsByTransactionId(string transactionId)
{
    var payments = await _context.PaymentHistories
        .Where(p => p.TransactionId == transactionId)
        .ToListAsync();

    return Ok(payments);
}

        // GET: api/IntransitFollowups/{id}        
[HttpGet("{id}")]
 public async Task<ActionResult<IntransitFollowup>> GetById(int id)
        {
            var followup = await _context.IntransitFollowups.FindAsync(id);

            if (followup == null)
            {
                return NotFound();
            }

            return followup;
        }

  
  // POST: api/IntransitFollowups/intransit
[HttpPost("intransit")]
public async Task<ActionResult<IntransitFollowup>> Create(IntransitFollowup followup)
{
    if (followup == null)
        return BadRequest("Followup data is required.");

    // --- Generate next TransactionId safely ---
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

    followup.TransactionId = $"SDT{nextNumber.ToString().PadLeft(6, '0')}";

    // --- Serialize items array ---
    if (followup.Items != null && followup.Items.Any())
    {
        followup.ItemQntyUomUnitprice = string.Join("; ", followup.Items.Select(
            it => $"{it.ItemDescription}:{it.Quantity} {it.Uom} @ {it.UnitPrice}$"
        ));

        followup.TotalAmountPaid ??= 0;

        followup.TotalPrice = followup.Items.Sum(it => it.Quantity * it.UnitPrice);
        followup.TotalAmountRemaning = followup.TotalPrice - followup.TotalAmountPaid.Value;

        followup.TotalPaidInPercent = followup.TotalPrice == 0
            ? 0
            : (followup.TotalAmountPaid.Value / followup.TotalPrice) * 100;

        followup.TotalRemaningInPercent = followup.TotalPrice == 0
            ? 0
            : (followup.TotalAmountRemaning / followup.TotalPrice) * 100;
    }
    else
    {
        followup.TotalPrice = 0;
        followup.TotalAmountPaid = 0;
        followup.TotalAmountRemaning = 0;
        followup.TotalPaidInPercent = 0;
        followup.TotalRemaningInPercent = 0;
        followup.ItemQntyUomUnitprice = string.Empty;
    }

    // --- Save to DB ---
    _context.IntransitFollowups.Add(followup);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = followup.Id }, followup);
}

[HttpPost("payment")]
public async Task<ActionResult> CreatePayment([FromBody] List<PaymentHistory> payments)
{
    if (payments == null || !payments.Any())
        return BadRequest("Payment data is required.");

    // 1️⃣ Insert new payments
    _context.PaymentHistories.AddRange(payments);
    await _context.SaveChangesAsync();

    // 2️⃣ Update totals for each transaction
    var transactionGroups = payments.GroupBy(p => p.TransactionId);

    foreach (var group in transactionGroups)
    {
        var transactionId = group.Key?.Trim();
        if (string.IsNullOrEmpty(transactionId)) continue;

        // Sum all payments for this transaction
        var totalPaid = await _context.PaymentHistories
            .Where(p => p.TransactionId == transactionId)
            .SumAsync(p => p.AmountPaid);

        // Find corresponding IntransitFollowup entry
        var intransitEntry = await _context.IntransitFollowups
            .FirstOrDefaultAsync(i => i.TransactionId.Trim() == transactionId);

        if (intransitEntry != null)
        {
            intransitEntry.TotalAmountPaid = totalPaid;

            // Recalculate remaining amounts and percentages
            intransitEntry.TotalAmountRemaning = intransitEntry.TotalPrice - totalPaid;

            // ✅ Set status to 1 if fully paid
            if (intransitEntry.TotalAmountRemaning == 0)
            {
                intransitEntry.status = 1;
            }

            intransitEntry.TotalPaidInPercent = intransitEntry.TotalPrice == 0
                ? 0
                : (totalPaid / intransitEntry.TotalPrice) * 100;

            intransitEntry.TotalRemaningInPercent = intransitEntry.TotalPrice == 0
                ? 0
                : (intransitEntry.TotalAmountRemaning / intransitEntry.TotalPrice) * 100;
        }
    }

    // 3️⃣ Save updates to IntransitFollowups
    await _context.SaveChangesAsync();

    return Ok(payments);
}

[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, IntransitFollowup data)
{
    if (id != data.Id)
        return BadRequest("ID mismatch");

    // --- Recalculate total price from serialized items ---
    if (!string.IsNullOrEmpty(data.ItemQntyUomUnitprice))
    {
        decimal totalPrice = 0;

        var items = data.ItemQntyUomUnitprice
            .Split(';', StringSplitOptions.RemoveEmptyEntries)
            .Select(item =>
            {
                var parts = item.Split('@', StringSplitOptions.TrimEntries);
                if (parts.Length != 2) return null;

                var descQty = parts[0].Split(':', StringSplitOptions.TrimEntries);
                if (descQty.Length != 2) return null;

                var quantityUom = descQty[1].Split(' ', StringSplitOptions.TrimEntries);
                if (quantityUom.Length != 2) return null;

                decimal quantity = decimal.Parse(quantityUom[0]);
                decimal unitPrice = decimal.Parse(parts[1].Replace("$", "").Trim());

                totalPrice += quantity * unitPrice;
                return new { quantity, unitPrice };
            })
            .Where(x => x != null)
            .ToList();

        data.TotalPrice = totalPrice;
    }
    else
    {
        data.TotalPrice = 0;
    }

    // --- Ensure null safety for TotalAmountPaid ---
    data.TotalAmountPaid ??= 0;

    // --- Recalculate totals ---
    data.TotalAmountRemaning = data.TotalPrice - data.TotalAmountPaid.Value;

    data.TotalPaidInPercent = data.TotalPrice == 0
        ? 0
        : (data.TotalAmountPaid.Value / data.TotalPrice) * 100;

    data.TotalRemaningInPercent = data.TotalPrice == 0
        ? 0
        : (data.TotalAmountRemaning / data.TotalPrice) * 100;

    _context.Entry(data).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!_context.IntransitFollowups.Any(e => e.Id == id))
            return NotFound();
        else
            throw;
    }

    return NoContent();
}
        // DELETE: api/IntransitFollowups/{id}
 [HttpDelete("{id}")]
public async Task<IActionResult> Delete(int id)
{
    var followup = await _context.IntransitFollowups.FindAsync(id);
    if (followup == null)
    {
        return NotFound();
    }

    // Soft delete: set status to 0
    followup.status = 0;
    _context.IntransitFollowups.Update(followup);
    await _context.SaveChangesAsync();

    return NoContent();
}


        private bool FollowupExists(int id)
        {
            return _context.IntransitFollowups.Any(e => e.Id == id);
        }
    }
}



