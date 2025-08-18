using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
public class PoItemsList
{
    public int Id { get; set; } // DB auto-increment
    public string? Uom { get; set; }
    [Column(TypeName = "decimal(10,2)")]
    public decimal? Quantity { get; set; }
     public string? PurchaseOrder { get; set; }
    [Column(TypeName = "decimal(10,2)")]
    public decimal? UnitPrice { get; set; }

       
}

    

    }

