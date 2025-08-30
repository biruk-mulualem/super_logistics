using System;
using System.Text.RegularExpressions;

namespace server.Services
{
    /// <summary>
    /// Extracts entities like TransactionId and Date from a user message.
    /// This is separated from ML logic for modularity.
    /// </summary>
    public class EntityExtractor
    {
        /// <summary>
        /// Extract transaction ID (e.g., SDT1, SIF2) from a message using regex.
        /// </summary>
        public string ExtractTransactionId(string message)
        {
            var match = Regex.Match(message, @"\b[A-Z]{3}\d+\b", RegexOptions.IgnoreCase);
            return match.Success ? match.Value.ToUpper() : null;
        }

        /// <summary>
        /// Extract date keywords like "today" or "yesterday" from a message.
        /// Converts them into DateTime values.
        /// </summary>
        public DateTime? ExtractDate(string message)
        {
            if (message.Contains("today", StringComparison.OrdinalIgnoreCase))
                return DateTime.Today;

            if (message.Contains("yesterday", StringComparison.OrdinalIgnoreCase))
                return DateTime.Today.AddDays(-1);

            return null;
        }
    }
}
