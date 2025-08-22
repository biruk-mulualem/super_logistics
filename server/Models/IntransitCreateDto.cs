using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
  public class IntransitCreateDto
{
    public DateOnly PurchaseDate { get; set; }
    public string PurchaseOrder { get; set; } = string.Empty;
    public string PurchaseCompany { get; set; } = string.Empty;
    public string ContactPerson { get; set; } = string.Empty;
    public string Origin { get; set; } = string.Empty;
    public string Remark { get; set; } = string.Empty;

    public List<IntransitItemsDetailDto> Items { get; set; } = new();
}

public class IntransitItemsDetailDto
{
    public string ItemDescription { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string Uom { get; set; } = string.Empty;
}
    }





