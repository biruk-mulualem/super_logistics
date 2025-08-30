using Microsoft.ML.Data;

namespace server.Models
{
    public class ModelInput
    {
        [LoadColumn(0)]  // User's input message
        public string Message { get; set; }

        [LoadColumn(1)]  // The intent label (the classification)
        public string Label { get; set; }
    }
}
