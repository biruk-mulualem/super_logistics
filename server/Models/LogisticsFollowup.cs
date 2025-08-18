using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class LogisticsFollowup
    { 
          public int Id { get; set; } // DB auto-increment
       public string? TransactionId { get; set; } // "SDT000001" etc.
        public string? ItemDescription { get; set; }
        public string? Uom { get; set; }
     [Column(TypeName = "decimal(10,2)")]
    public decimal? TotalPaidInPercent { get; set; }
        public int? LoadedOnfcl { get; set; }
        public string? ContainerType { get; set; }
        public string? BillNo { get; set; }
        public string? truckWayBill { get; set; }
        public string? DocOwner { get; set; }
        public string? Shipper { get; set; }
        public string? Transitor { get; set; }
        public DateOnly? Etadjb { get; set; }
        public DateOnly? LoadingDate { get; set; }
        public DateOnly? DjbArrived { get; set; }
        public DateOnly? DocSentDjb { get; set; }
        public DateOnly? DocCollected { get; set; }
        public DateOnly? BillCollected { get; set; }
        public DateOnly? TaxPaid { get; set; }
        public DateOnly? DjbDeparted { get; set; }
        public DateOnly? AkkArrived { get; set; }
        public DateOnly? SdtArrived { get; set; }
        public int? EmpityContainersLeftUnreturned { get; set; }
          public string? Origin { get; set; }
        public string? Remark { get; set; }
    }
}
