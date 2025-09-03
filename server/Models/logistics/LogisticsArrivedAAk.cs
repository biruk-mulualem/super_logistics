using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class LogisticsArrivedAAk
    {
          public int Id { get; set; } // DB auto-increment
        public string? TransactionId { get; set; } 
        public int? NumberOfContainer { get; set; }
        public DateOnly? Date { get; set; }
        public string? Remark { get; set; }
      
    }


}
