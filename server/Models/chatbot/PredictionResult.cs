using System;

namespace server.Models
{
    public class PredictionResult
    {
        public string Intent { get; set; }           // The predicted intent
        public string TransactionId { get; set; }    // Extracted transaction ID (e.g., SDT1)
        public DateTime? Date { get; set; }          // Extracted date (today, yesterday, etc.)
    }
    }





