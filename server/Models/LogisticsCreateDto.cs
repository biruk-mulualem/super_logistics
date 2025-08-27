using System;
using System.Collections.Generic;

namespace server.Models
{
    public class LogisticsCreateDto
    {
        // Top-level logistics followup fields
        public int LoadedOnfcl { get; set; }
        public string ContainerType { get; set; } = string.Empty;
        public string Remark { get; set; } = string.Empty;
        public string? Origin { get; set; } = string.Empty;

        public string? BillNo { get; set; }
        public string? truckWayBill { get; set; }
       public string? Shipper { get; set; }
public DateOnly? Etadjb { get; set; }
public DateOnly? LoadingDate { get; set; }

        public string? Transitor { get; set; }
        public DateOnly? SdtArrived { get; set; }
        public DateOnly? AkkArrived { get; set; }
        public DateOnly? DjbDeparted { get; set; }
        public DateOnly? DjbArrived { get; set; }
        public int? EmpityContainersLeftUnreturned { get; set; }
        public DateOnly? BillCollected { get; set; }
        public DateOnly? TaxPaid { get; set; }
        public DateOnly? DocSentDjb { get; set; }
        public DateOnly? DocCollected { get; set; }
        public string? DocOwner { get; set; }
        

        public List<LogisticsItemDto> Items { get; set; } = new();
    }

    public class LogisticsItemDto
    {
        public string IntransitId { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string ItemDescription { get; set; } = string.Empty;
        public decimal? Quantity { get; set; }
        public decimal? LoadedQnty { get; set; }
        public decimal? RemaningQnty { get; set; }
        public decimal? TotalQnty { get; set; }
        public string? Uom { get; set; } = string.Empty;
        public decimal? TotalQuantity { get; set; }
    }
}
