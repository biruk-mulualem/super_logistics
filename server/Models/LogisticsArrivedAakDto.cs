namespace server.Models
{
    public class LogisticsArrivedAakDto
    {
        public string? TransactionId { get; set; }
        public int? NumberOfContainer { get; set; }
        public DateOnly? Date { get; set; }
        public string? Remark { get; set; }
    }
}
