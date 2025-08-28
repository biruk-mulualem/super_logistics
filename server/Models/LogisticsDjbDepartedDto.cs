namespace server.Models
{
    public class LogisticsDjbDepartedDto
    {
        public string? TransactionId { get; set; }
        public int? NumberOfContainer { get; set; }
        public DateOnly? Date { get; set; }
        public string? Remark { get; set; }
    }
}
