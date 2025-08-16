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
     // POST: api/IntransitFollowups
        [HttpPost]
        public async Task<ActionResult<IntransitFollowup>> Create(IntransitFollowup followup)
        {
            _context.IntransitFollowups.Add(followup);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = followup.Id }, followup);
        }

        // PUT: api/IntransitFollowups/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, IntransitFollowup followup)
        {
            if (id != followup.Id)
            {
                return BadRequest();
            }

            _context.Entry(followup).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FollowupExists(id))
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
