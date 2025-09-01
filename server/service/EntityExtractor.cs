using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace server.Services
{
    /// <summary>
    /// Extracts entities like TransactionId, Date, Item details, UOM, GRN, PO, and Contact from a message.
    /// </summary>
    public class EntityExtractor
    {
        // --- Transaction ID ---
        public string? ExtractTransactionId(string message)
        {
            var match = Regex.Match(message, @"\b[A-Z]{3}\d+\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value.ToUpper() : null;
        }

        // --- Date keywords ---
        public DateTime? ExtractDate(string message)
        {
            if (message.Contains("today", StringComparison.OrdinalIgnoreCase))
                return DateTime.Today;
            if (message.Contains("yesterday", StringComparison.OrdinalIgnoreCase))
                return DateTime.Today.AddDays(-1);

            // Match explicit dates like 2025-08-30, 30/08/2025, 08/30/2025
            var match = Regex.Match(message, @"\b(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4})\b");
            if (match.Success && DateTime.TryParse(match.Value, out var dt))
                return dt;

            return null;
        }

        // --- Item descriptions ---
        public List<string> ExtractItemDescriptions(string message)
        {
            var items = new List<string>();
            var matches = Regex.Matches(message, @"\b(first|second|third|fourth|fifth|all)\s+item\b", RegexOptions.IgnoreCase);
            foreach (Match match in matches)
                items.Add(match.Value.ToLower());
            return items;
        }

        // --- Quantities ---
        public decimal? ExtractLoadedQuantity(string message)
        {
            var match = Regex.Match(message, @"loaded\s+(\d+)", RegexOptions.IgnoreCase);
            return match.Success ? decimal.Parse(match.Groups[1].Value) : null;
        }

        public decimal? ExtractRemainingQuantity(string message)
        {
            var match = Regex.Match(message, @"remaining\s+(\d+)", RegexOptions.IgnoreCase);
            return match.Success ? decimal.Parse(match.Groups[1].Value) : null;
        }

        // --- Total Price ---
        public decimal? ExtractTotalPrice(string message)
        {
            var match = Regex.Match(message, @"\b(total price|price)\s*[:=]?\s*\$?(\d+(\.\d{1,2})?)", RegexOptions.IgnoreCase);
            if (match.Success && decimal.TryParse(match.Groups[2].Value, out var value))
                return value;
            return null;
        }

        // --- Total Amount Paid ---
        public decimal? ExtractTotalAmountPaid(string message)
        {
            var match = Regex.Match(message, @"\b(paid|amount paid|total paid)\s*[:=]?\s*\$?(\d+(\.\d{1,2})?)", RegexOptions.IgnoreCase);
            if (match.Success && decimal.TryParse(match.Groups[2].Value, out var value))
                return value;
            return null;
        }

        // --- Total Amount Remaining ---
        public decimal? ExtractTotalAmountRemaining(string message)
        {
            var match = Regex.Match(message, @"\b(remaining|balance|amount left)\s*[:=]?\s*\$?(\d+(\.\d{1,2})?)", RegexOptions.IgnoreCase);
            if (match.Success && decimal.TryParse(match.Groups[2].Value, out var value))
                return value;
            return null;
        }

        // --- Loaded Quantity ---



        // --- Remaining Quantity ---


        // --- Unit Price ---
        public decimal? ExtractUnitPrice(string message)
        {
            var match = Regex.Match(message, @"\b(unit price|per unit)\s*[:=]?\s*\$?(\d+(\.\d{1,2})?)", RegexOptions.IgnoreCase);
            if (match.Success && decimal.TryParse(match.Groups[2].Value, out var value))
                return value;
            return null;
        }


        // --- Prices ---



        // --- UOM ---
        public string? ExtractUom(string message)
        {
            var match = Regex.Match(message, @"\b(uom|unit of measure|kg|liters|pieces|pcs)\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value : null;
        }

        // --- GRN ---
        public string? ExtractGrn(string message)
        {
            var match = Regex.Match(message, @"\bGRN\d+\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value.ToUpper() : null;
        }

        // --- Purchase Order ---
        public string? ExtractPurchaseOrder(string message)
        {
            var match = Regex.Match(message, @"\bPO\d+\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value.ToUpper() : null;
        }

        // --- Contact person or company ---
        public string? ExtractContactPerson(string message)
        {
            var match = Regex.Match(message, @"person\s*:\s*([A-Za-z ]+)", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value.Trim() : null;
        }

        public string? ExtractPurchaseCompany(string message)
        {
            var match = Regex.Match(message, @"company\s*:\s*([A-Za-z ]+)", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value.Trim() : null;
        }

        // --- Transaction status ---
        public string? ExtractTransactionStatus(string message)
        {
            var match = Regex.Match(message, @"\b(pending|completed|in\s*progress|cancelled|failed)\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value.ToLower() : null;
        }
    }
}
