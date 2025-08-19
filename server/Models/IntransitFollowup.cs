using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class IntransitFollowup
    {
        public int Id { get; set; } // DB auto-increment
        public string? TransactionId { get; set; } // "SDT000001" etc.
        public string? ItemQntyUomUnitprice { get; set; } 
        public DateOnly? PurchaseDate { get; set; }
        public string? PurchaseOrder { get; set; }
        public string? PurchaseCompany { get; set; }
        public string? ContactPerson { get; set; }
        public string? PaidFrom { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? TotalPrice { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? TotalAmountPaid { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? TotalPaidInPercent { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? QntyRecived { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? QntyRemaning { get; set; }
        public string? Grn { get; set; }
        public string? Origin { get; set; }
        public string? Remark { get; set; }
        // Not mapped property to accept items array from Angular
        [NotMapped]
        public List<Item>? Items { get; set; }
    }

    public class Item
    {
        public string ItemDescription { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Uom { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
    }
}
