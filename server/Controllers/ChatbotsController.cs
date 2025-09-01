using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotsController : ControllerBase
    {
        private readonly IntentClassifier _classifier;
        private readonly ResponseGenerator _responseGenerator;

        public ChatbotsController(IntentClassifier classifier, ResponseGenerator responseGenerator)
        {
            _classifier = classifier;
            _responseGenerator = responseGenerator;
        }


        [HttpPost]
        public IActionResult PostMessage([FromBody] ChatRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message cannot be empty");

            // Predict intent and extract entities
            var prediction = _classifier.PredictWithEntities(request.Message);
            // Print result to console in JSON format
            Console.WriteLine("🔮 Prediction Result:");
            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(prediction,
                new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));

            // Generate response using separate service
            string botReply = _responseGenerator.GenerateResponse(prediction.Intent);

            // Return the response including transaction ID and date
            return Ok(new
            {
                Response = botReply,
                // TransactionId = prediction.TransactionId,
                // Date = prediction.Date
            });
        }
    }
}
