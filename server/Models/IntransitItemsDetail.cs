using System;
using System.ComponentModel.DataAnnotations.Schema; // ✅ Add this
namespace server.Models
{
    public class IntransitItemsDetail
    {
        public int Id { get; set; } // DB auto-increment
        public string? TransactionId { get; set; } // "SDT000001" etc.
        public string ItemDescription { get; set; } = string.Empty;

           [Column(TypeName = "decimal(25,3)")]
        public decimal Quantity { get; set; }
        public string Uom { get; set; } = string.Empty;

           [Column(TypeName = "decimal(25,3)")]
        public decimal UnitPrice { get; set; }
    }
}




