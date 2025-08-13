using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoriesController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public HistoriesController(LogisticsContext context)
        {
            _context = context;
        }

        // GET: api/histories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<History>>> GetHistories()
        {
            return await _context.Histories.ToListAsync();
        }

        // GET: api/histories/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<History>> GetHistory(int id)
        {
            var history = await _context.Histories.FindAsync(id);

            if (history == null)
            {
                return NotFound();
            }

            return history;
        }

        // POST: api/histories
        [HttpPost]
        public async Task<ActionResult<History>> PostHistory(History history)
        {
            _context.Histories.Add(history);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHistory), new { id = history.Id }, history);
        }

        // PUT: api/histories/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHistory(int id, History history)
        {
            if (id != history.Id)
            {
                return BadRequest();
            }

            _context.Entry(history).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistoryExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/histories/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHistory(int id)
        {
            var history = await _context.Histories.FindAsync(id);
            if (history == null)
            {
                return NotFound();
            }

            _context.Histories.Remove(history);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HistoryExists(int id)
        {
            return _context.Histories.Any(e => e.Id == id);
        }
    }
}
