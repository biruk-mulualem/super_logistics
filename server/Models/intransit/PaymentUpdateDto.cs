using System;
using System.Collections.Generic;

namespace server.Models
{
    public class PaymentUpdateDto
    {
        public List<PaymentDto> Payments { get; set; }
    }

    public class PaymentDto
    {
        public decimal AmountPaid { get; set; }
        public string PaidBy { get; set; }
        public string AccountPaidFrom { get; set; }
        public DateOnly PaidDate { get; set; }
    }
}
