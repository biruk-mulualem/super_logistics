using System;
using System.Collections.Generic;

namespace server.Models
{
    public class LogisticsCreateDto
    {
       
        public int LoadedOnfcl { get; set; }
        public string ContainerType { get; set; } = string.Empty;
        public string Remark { get; set; } = string.Empty;
        public string? Origin { get; set; } = string.Empty;

        public List<LogisticsItemDto> Items { get; set; } = new();
    }

    public class LogisticsItemDto
    {

         public string IntransitId { get; set; } = string.Empty; // instead of TransactionId
        public string TransactionId { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal? LoadedQnty { get; set; }
        public decimal? RemaningQnty { get; set; }
        public decimal? TotalQnty { get; set; }
        public string? Uom { get; set; } = string.Empty;
        public decimal? TotalQuantity { get; set; }

    }
}
