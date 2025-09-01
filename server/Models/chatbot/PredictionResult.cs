using System;

namespace server.Models
{
    public class PredictionResult
    {
        public string? Intent { get; set; }                // The predicted intent
        public string? TransactionId { get; set; }        // Extracted transaction ID (e.g., SDT1)
        public DateTime? Date { get; set; }               // Extracted date (today, yesterday, etc.)
        public decimal? TotalPrice { get; set; }          // Extracted total price
        public decimal? TotalAmountPaid { get; set; }     // Extracted amount already paid
        public decimal? TotalAmountRemaining { get; set; } // Extracted remaining amount
        public decimal? LoadedQuantity { get; set; }      // Loaded quantity of items
        public decimal? RemainingQuantity { get; set; }   // Remaining quantity of itemsa
        public decimal? UnitPrice { get; set; }           // Price per unit
        public string? ItemDescription { get; set; }      // Description of the item
        public string? Uom { get; set; }                  // Unit of measure
        public string? Grn { get; set; }                  // Goods Receipt Number
        public string? PurchaseOrder { get; set; }        // Purchase order number
        public DateTime? PurchaseDate { get; set; }       // Purchase date
        public string? ContactPerson { get; set; }        // Contact person
        public string? PurchaseCompany { get; set; }      // Company that made the purchase
        public string? TransactionStatus { get; set; }    // Status of the transaction
    }
}
