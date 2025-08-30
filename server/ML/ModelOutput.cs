using Microsoft.ML.Data;

namespace server.Models
{
    public class ModelOutput
    {
        [ColumnName("PredictedLabel")]  // Predicted intent (e.g., TrackShipment)
        public string PredictedIntent { get; set; }
    }
}
