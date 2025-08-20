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

        // GET: api/IntransitFollowups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IntransitFollowup>>> GetAll()
        {
            return await _context.IntransitFollowups.ToListAsync();
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

  
  // POST: api/IntransitFollowups
[HttpPost]
public async Task<ActionResult<IntransitFollowup>> Create(IntransitFollowup followup)
{
    if (followup == null)
        return BadRequest("Followup data is required.");

    // --- Generate next TransactionId safely ---
    var lastTransaction = await _context.IntransitFollowups
        .AsNoTracking() // Prevent EF Core tracking conflicts
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

    // --- Serialize items array into a single string ---
    if (followup.Items != null && followup.Items.Any())
    {
        followup.ItemQntyUomUnitprice = string.Join("; ", followup.Items.Select(
            it => $"{it.ItemDescription}:{it.Quantity} {it.Uom} @ {it.UnitPrice}$"
        ));

        // Set defaults if null
        followup.TotalAmountPaid ??= 0;

        // Calculate total price of all items
        followup.TotalPrice = followup.Items.Sum(it => it.Quantity * it.UnitPrice);

        // Calculate total paid in percent safely
        followup.TotalPaidInPercent = followup.TotalPrice == 0
            ? 0
            : (followup.TotalAmountPaid.Value / followup.TotalPrice) * 100;
    }
    else
    {
        // No items, set totals to 0
        followup.TotalPrice = 0;
        followup.TotalAmountPaid = 0;
        followup.TotalPaidInPercent = 0;
        followup.ItemQntyUomUnitprice = string.Empty;
    }

    // --- Add new entity ---
    _context.IntransitFollowups.Add(followup);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = followup.Id }, followup);
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
                string itemDescription = descQty[0];

                totalPrice += quantity * unitPrice;

                // --- Explicit log ---
                // Console.WriteLine($"Item Description: {itemDescription}, Quantity: {quantity}, Unit Price: {unitPrice}, Running Total: {totalPrice}");
                return new { itemDescription, quantity, unitPrice };
            })
            .Where(x => x != null)
            .ToList();

        data.TotalPrice = totalPrice;
        Console.WriteLine($"Calculated Total Price: {data.TotalPrice}");
    }

    // --- Recalculate total paid in percent ---
    if (data.TotalPrice > 0)
    {
        data.TotalPaidInPercent = (data.TotalAmountPaid / data.TotalPrice) * 100;
    }
    else
    {
        data.TotalPaidInPercent = 0;
    }

    // Console.WriteLine($"Total Amount Paid: {data.TotalAmountPaid}, Total Paid (%) : {data.TotalPaidInPercent}");

    _context.Entry(data).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
        Console.WriteLine("Update saved successfully.");
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

            _context.IntransitFollowups.Remove(followup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FollowupExists(int id)
        {
            return _context.IntransitFollowups.Any(e => e.Id == id);
        }
    }
}



