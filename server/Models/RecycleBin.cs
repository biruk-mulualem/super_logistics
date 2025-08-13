using System;

namespace server.Models
{
    public class RecycleBin
    {
        public int Id { get; set; }
        public string? ItemDescription { get; set; }
        public string? BillNo { get; set; }
        public string? Shipper { get; set; }
        public string? Transitor { get; set; }
        public string? Uom { get; set; }
        public int Quantity { get; set; }
        public DateTime LoadingDate { get; set; }
        public DateTime? DjbArrived { get; set; }
        public DateTime? DjbDeparted { get; set; }
        public DateTime? AkkArrived { get; set; }
        public DateTime? SdtArrived { get; set; }
        public bool ContReturned { get; set; }
        public string? Remark { get; set; }
    }
}
