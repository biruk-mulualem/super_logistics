using System;
using System.ComponentModel.DataAnnotations.Schema; // ✅ Add this
namespace server.Models
{
    public class logisticsItemsDetail
    {
        public int Id { get; set; } // DB auto-increment
        public string? TransactionId { get; set; } // "SLF000001" etc.
        public string? ItemDescription { get; set; } = string.Empty;
           [Column(TypeName = "decimal(25,3)")]
        public decimal? Quantity { get; set; }
        public string? Uom { get; set; } = string.Empty;
         [Column(TypeName = "decimal(25,3)")]
        public decimal? LoadedQnty { get; set; }

         [Column(TypeName = "decimal(25,3)")]
        public decimal? RemaningQnty { get; set; }


           [Column(TypeName = "decimal(25,3)")]
        public decimal? TotalQnty { get; set; }

         public DateOnly? Date { get; set; }

               public int? status { get; set; }
                 public string? IntransitId { get; set; } // "SLF000001" etc.
    }
}




