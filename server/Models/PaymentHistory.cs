using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace server.Models
{
    public class PaymentHistory
    {
        public int Id { get; set; } // optional for EF Core
        public string? TransactionId { get; set; } // "SDT000001" etc.
        
          [Column(TypeName = "decimal(25,3)")]
        public decimal AmountPaid { get; set; }
        public string PaidBy { get; set; } = string.Empty;
        public string AccountPaidFrom { get; set; } = string.Empty;
        public DateOnly PaidDate { get; set; }
    }
    }





