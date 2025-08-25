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
[HttpGet("IntransitData")]
public async Task<ActionResult<IEnumerable<object>>> GetIntransitsWithItems()
{
    var data = await _context.IntransitFollowups
        .Select(f => new 
        {
            f.TransactionId,
            Items = _context.IntransitItemsDetails
                .Where(i => i.TransactionId == f.TransactionId)
                .Select(i => new { i.ItemDescription, i.Uom, i.Quantity })
                .ToList()
        }).ToListAsync();
     
    return Ok(data);
    
}

        private bool LogisticsFollowupExists(int id)
        {
            return _context.LogisticsFollowups.Any(e => e.Id == id);
        }
    }
}
