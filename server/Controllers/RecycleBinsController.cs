using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecycleBinsController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public RecycleBinsController(LogisticsContext context)
        {
            _context = context;
        }

        // GET: api/recyclebins
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecycleBin>>> GetRecycleBins()
        {
            var recycleBins = await _context.RecycleBins.ToListAsync();
            return Ok(recycleBins);
        }

        // GET: api/recyclebins/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RecycleBin>> GetRecycleBin(int id)
        {
            var recycleBin = await _context.RecycleBins.FindAsync(id);

            if (recycleBin == null)
            {
                return NotFound();
            }

            return recycleBin;
        }

        // DELETE: api/recyclebins/deletepermanently/{id}
        [HttpDelete("deletepermanently/{id}")]
        public async Task<IActionResult> PermanentlyDeleteRecycleBinItem(int id)
        {
            var recycleBinItem = await _context.RecycleBins.FindAsync(id);
            if (recycleBinItem == null)
            {
                return NotFound();
            }

            // Permanently delete from RecycleBin
            _context.RecycleBins.Remove(recycleBinItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Optionally: Clear the entire Recycle Bin (delete all items)
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearRecycleBin()
        {
            var allItems = await _context.RecycleBins.ToListAsync();
            _context.RecycleBins.RemoveRange(allItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
