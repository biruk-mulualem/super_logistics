using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class IntransitFollowup
    {
        public int Id { get; set; } // DB auto-increment
        public string? TransactionId { get; set; } // "SDT000001" etc.
  
        public DateOnly? PurchaseDate { get; set; }
        public string? PurchaseOrder { get; set; }
        public string? PurchaseCompany { get; set; }
        public string? ContactPerson { get; set; }

        [Column(TypeName = "decimal(25,3)")]
        public decimal? TotalPrice { get; set; }
        
        [Column(TypeName = "decimal(25,3)")]
        public decimal? TotalAmountPaid { get; set; }

         [Column(TypeName = "decimal(25,3)")]
        public decimal? TotalAmountRemaning { get; set; }


         [Column(TypeName = "decimal(25,3)")]
        public decimal? TotalPaidInPercent { get; set; }

         [Column(TypeName = "decimal(25,3)")]
        public decimal? TotalRemaningInPercent { get; set; }
        public string? Grn { get; set; }
        public string? Origin { get; set; }
        public string? Remark { get; set; }
            public int? status { get; set; }
      
    }


}
