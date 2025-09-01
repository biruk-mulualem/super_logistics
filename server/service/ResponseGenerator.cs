using server.Models;
using System.Collections.Generic;

namespace server.Services
{
    public class ResponseGenerator
    {

           private readonly LogisticsContext _context;
        // Generate bot response based on predicted intent and provided entity data
         public ResponseGenerator(LogisticsContext context)
        {
            _context = context;
        }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
        public string GenerateResponse(Dictionary<string, object> entityData, string intent)
        {
            switch (intent)
            {
                case "GetAllIntransitStatus":
                  var query = _context.IntransitFollowups.AsQueryable();
                        if (entityData.ContainsKey("TransactionId") && entityData["TransactionId"] != null)
                        query = query.Where(x => x.TransactionId == (string)entityData["TransactionId"]);

                    if (entityData.ContainsKey("PurchaseOrder") && entityData["PurchaseOrder"] != null)
                        query = query.Where(x => x.PurchaseOrder == (string)entityData["PurchaseOrder"]);
                    var results = query.ToList();
                    if (results.Count == 0)
                        return "No matching intransit updates found.";
                    // Format results for bot
                    return string.Join("\n", results.Select(r =>
                        $"TransactionId: {r.TransactionId}, PurchaseOrder: {r.PurchaseOrder}"));

                default:
                    return "Sorry, I didn’t understand that. Can you rephrase?";
            }
        }










    }
}
