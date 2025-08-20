using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace server.Models
{
    public class PaymentHistory
    {
        public int Id { get; set; } // optional for EF Core
        public string? TransactionId { get; set; } // "SDT000001" etc.
        public decimal AmountPaid { get; set; }
        public string PaidBy { get; set; } = string.Empty;
        public string AccountPaidFrom { get; set; } = string.Empty;
        public DateOnly PaidDate { get; set; }
    }
    }





