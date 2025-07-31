using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserLog>>> GetUserLogs()
        {
            return await _context.UserLogs.ToListAsync();
        }

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

        [HttpPost]
        public async Task<ActionResult<UserLog>> PostUserLog(UserLog userLog)
        {
            _context.UserLogs.Add(userLog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserLog), new { id = userLog.Id }, userLog);
        }

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
                if (!await _context.UserLogs.AnyAsync(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

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
    }
}
