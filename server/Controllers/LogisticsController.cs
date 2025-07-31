using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace server.Controllers
{
    // 🔧 This controller handles all requests to /api/logistics
    // [ApiController] adds automatic model binding, validation, and 400 responses
    // [Route("api/[controller]")] means this controller is mapped to /api/logistics (based on the class name)
    [Route("api/[controller]")]
    [ApiController]
    public class LogisticsController : ControllerBase
    {
        // ✨ Dependency injection for your database context (EF Core)
        // 🚫 Do NOT remove or rename this without updating all DB access points
        private readonly LogisticsContext _context;

        // ✅ Constructor receives the context and stores it in _context
        // 💡 You can add other services (e.g., ILogger, IConfiguration) here later
        public LogisticsController(LogisticsContext context)
        {
            _context = context;
        }

        // 🔹 GET: api/Logistics
        // ✅ Retrieves ALL logistics items from the database
        // ✏️ You can enhance this later with search, filtering, or pagination
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogisticsItem>>> GetLogisticsItems()
        {
            return await _context.LogisticsItems.ToListAsync();
        }

        // 🔹 GET: api/Logistics/{id}
        // ✅ Retrieves a single item by its ID
        // 💡 You can include related data with `.Include(...)` if needed
        // 🚫 Do not return null directly — use `NotFound()` for proper HTTP response
        [HttpGet("{id}")]
        public async Task<ActionResult<LogisticsItem>> GetLogisticsItem(int id)
        {
            var item = await _context.LogisticsItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(); // returns 404 if item is not found
            }

            return item; // returns 200 with item data
        }

        // 🔹 POST: api/Logistics
        // ✅ Creates a new LogisticsItem from frontend JSON
        // ✏️ You can add validation logic to reject bad data (e.g. ModelState)
        // 🚫 Do NOT remove CreatedAtAction — it's standard REST practice
        [HttpPost]
        public async Task<ActionResult<LogisticsItem>> PostLogisticsItem(LogisticsItem item)
        {
            _context.LogisticsItems.Add(item);       // Adds to EF Core's change tracker
            await _context.SaveChangesAsync();       // Writes to DB

            // Returns 201 Created with a Location header pointing to the new item
            return CreatedAtAction(nameof(GetLogisticsItem), new { id = item.Id }, item);
        }

        // 🔹 PUT: api/Logistics/{id}
        // ✅ Updates an existing LogisticsItem by ID
        // 🚫 Do not allow updates if `id != item.Id` — prevents mismatched updates
        // 💡 Use EntityState.Modified only when you're sure the item exists
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLogisticsItem(int id, LogisticsItem item)
        {
            if (id != item.Id)
            {
                return BadRequest(); // 400 - Mismatched IDs
            }

            _context.Entry(item).State = EntityState.Modified; // Tell EF to update this entity

            try
            {
                await _context.SaveChangesAsync(); // Save changes to DB
            }
            catch (DbUpdateConcurrencyException)
            {
                // 🔄 Handles the case where someone deleted the record you're trying to update
                if (!await _context.LogisticsItems.AnyAsync(e => e.Id == id))
                {
                    return NotFound(); // 404 - Not found for update
                }
                else
                {
                    throw; // Something else went wrong — rethrow the error
                }
            }

            return NoContent(); // 204 - Update successful, but no content returned
        }

        // 🔹 DELETE: api/Logistics/{id}
        // ✅ Deletes an item by ID
        // 🚫 Don’t try to remove if item doesn’t exist — always check first
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogisticsItem(int id)
        {
            var item = await _context.LogisticsItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(); // 404 - No item to delete
            }

            _context.LogisticsItems.Remove(item); // Mark for deletion
            await _context.SaveChangesAsync();    // Apply changes to DB

            return NoContent(); // 204 - Successfully deleted
        }
    }
}
