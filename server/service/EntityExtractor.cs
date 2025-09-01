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

    

        // --- Purchase Order ---
        public string? ExtractPurchaseOrder(string message)
        {
            var match = Regex.Match(message, @"\bPO\d+\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value.ToUpper() : null;
        }

 // --- Item descriptions ---
public string? ExtractItemDescription(string message)
{
    // Match patterns like "Item X", "product Y", or standalone material names
    var match = Regex.Match(message, @"\b(Item|product)\s+([A-Za-z0-9\-]+)\b|(\bTitanium\b|\bIron\s*Oxide\b|\bNipples\b)", RegexOptions.IgnoreCase);

    if (match.Success)
    {
        if (!string.IsNullOrEmpty(match.Groups[2].Value))
            return match.Groups[2].Value; // the name after "Item" or "product"
        if (!string.IsNullOrEmpty(match.Groups[3].Value))
            return match.Groups[3].Value; // standalone material
    }

    return null; // no match found
}


    }
}
