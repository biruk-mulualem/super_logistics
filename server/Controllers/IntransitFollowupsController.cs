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
    // Generate next TransactionId
    var lastTransaction = await _context.IntransitFollowups
        .OrderByDescending(f => f.Id)
        .FirstOrDefaultAsync();

    int nextNumber = 1;
    if (lastTransaction != null && lastTransaction.TransactionId != null)
    {
        // Extract numeric part of TransactionId (assuming format "SDT000001")
        var numericPart = lastTransaction.TransactionId.Substring(3);
        if (int.TryParse(numericPart, out int lastNumber))
        {
            nextNumber = lastNumber + 1;
        }
    }

    followup.TransactionId = $"SDT{nextNumber.ToString().PadLeft(6, '0')}";

    // Optional: Calculate TotalPrice if Quantity and UnitPrice are provided
    if (followup.Quantity.HasValue && followup.UnitPrice.HasValue)
    {
        followup.TotalPrice = followup.Quantity.Value * followup.UnitPrice.Value;
    }

    _context.IntransitFollowups.Add(followup);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(GetById), new { id = followup.Id }, followup);
}


[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, IntransitFollowup dbValue)
{
    if (id != dbValue.Id)
        return BadRequest();
//          Console.WriteLine($"======================Received Quantity: {dbValue.Quantity}");
//     Console.WriteLine($"======================Received UnitPrice: {dbValue.UnitPrice}");
//  Console.WriteLine($"=========================Received TotalAmountPaid: {dbValue.TotalAmountPaid}");

    // Fetch existing entity from the database
    var followup = await _context.IntransitFollowups.FindAsync(id);
    if (followup == null)
        return NotFound();
    // Update editable fields
    followup.ItemDescription = dbValue.ItemDescription;
    followup.Uom = dbValue.Uom;
    followup.Quantity = dbValue.Quantity;
    followup.UnitPrice = dbValue.UnitPrice;
    followup.ContactPerson = dbValue.ContactPerson;
    followup.PurchaseCompany = dbValue.PurchaseCompany;
    followup.PurchaseDate = dbValue.PurchaseDate;
    followup.PaidFrom = dbValue.PaidFrom;
    followup.Origin = dbValue.Origin;
    followup.Grn = dbValue.Grn;
    followup.Remark = dbValue.Remark;
    followup.QntyRecived = dbValue.QntyRecived;
    followup.QntyRemaning = dbValue.QntyRemaning;
    followup.TotalAmountPaid = dbValue.TotalAmountPaid;
    followup.TotalPaidInPercent = dbValue.TotalPaidInPercent;
      followup.PurchaseOrder = dbValue.PurchaseOrder;
    // Recalculate TotalPrice based on Quantity and UnitPrice
    if (followup.Quantity.HasValue && followup.UnitPrice.HasValue)
    {
        followup.TotalPrice = followup.Quantity.Value * followup.UnitPrice.Value;
    }
    //  Console.WriteLine($"=======================Calculated TotalPrice: {followup.TotalPrice}");
if (followup.TotalPrice.HasValue && followup.TotalPrice.Value != 0 && followup.TotalAmountPaid.HasValue)
{
    followup.TotalPaidInPercent = (followup.TotalAmountPaid.Value / followup.TotalPrice.Value) * 100;
}
else
{
    followup.TotalPaidInPercent = 0;
}
// Console.WriteLine($"=======================Calculated paid in %: {followup.TotalPaidInPercent}");

    await _context.SaveChangesAsync();

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



