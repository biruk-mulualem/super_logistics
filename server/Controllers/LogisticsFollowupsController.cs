using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogisticsFollowupsController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public LogisticsFollowupsController(LogisticsContext context)
        {
            _context = context;
        }

        // GET: api/logisticsfollowups
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LogisticsFollowup>>> GetLogisticsFollowups()
        {
            return await _context.LogisticsFollowups.ToListAsync();
        }

        // GET: api/logisticsfollowups/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LogisticsFollowup>> GetLogisticsFollowup(int id)
        {
            var logisticsFollowup = await _context.LogisticsFollowups.FindAsync(id);

            if (logisticsFollowup == null)
            {
                return NotFound();
            }

            return logisticsFollowup;
        }

        // POST: api/logisticsfollowups
        [HttpPost]
        public async Task<ActionResult<LogisticsFollowup>> PostLogisticsFollowup(LogisticsFollowup logisticsFollowup)
        {
            _context.LogisticsFollowups.Add(logisticsFollowup);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLogisticsFollowup), new { id = logisticsFollowup.Id }, logisticsFollowup);
        }

        // PUT: api/logisticsfollowups/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLogisticsFollowup(int id, LogisticsFollowup logisticsFollowup)
        {
            if (id != logisticsFollowup.Id)
            {
                return BadRequest();
            }

            _context.Entry(logisticsFollowup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogisticsFollowupExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/logisticsfollowups/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLogisticsFollowup(int id)
        {
            var logisticsFollowup = await _context.LogisticsFollowups.FindAsync(id);
            if (logisticsFollowup == null)
            {
                return NotFound();
            }

            _context.LogisticsFollowups.Remove(logisticsFollowup);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LogisticsFollowupExists(int id)
        {
            return _context.LogisticsFollowups.Any(e => e.Id == id);
        }
    }
}
