using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLogsController : ControllerBase
    {
        private readonly LogisticsContext _context;

        public UserLogsController(LogisticsContext context)
        {
            _context = context;
        }

        // GET: api/userlogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserLog>>> GetUserLogs()
        {
            return await _context.UserLogs.ToListAsync();
        }

        // GET: api/userlogs/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserLog>> GetUserLog(int id)
        {
            var userLog = await _context.UserLogs.FindAsync(id);

            if (userLog == null)
            {
                return NotFound();
            }

            return userLog;
        }

        // POST: api/userlogs
        [HttpPost]
        public async Task<ActionResult<UserLog>> PostUserLog(UserLog userLog)
        {
            _context.UserLogs.Add(userLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserLog), new { id = userLog.Id }, userLog);
        }

        // PUT: api/userlogs/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserLog(int id, UserLog userLog)
        {
            if (id != userLog.Id)
            {
                return BadRequest();
            }

            _context.Entry(userLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLogExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/userlogs/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserLog(int id)
        {
            var userLog = await _context.UserLogs.FindAsync(id);
            if (userLog == null)
            {
                return NotFound();
            }

            _context.UserLogs.Remove(userLog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserLogExists(int id)
        {
            return _context.UserLogs.Any(e => e.Id == id);
        }
    }
}
