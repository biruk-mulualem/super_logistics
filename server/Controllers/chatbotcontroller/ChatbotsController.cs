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

    // Predict intent and extract ALL entities
    var prediction = _classifier.PredictWithEntities(request.Message);

    // Build dictionary of non-null properties
    var nonNullData = new Dictionary<string, object>();
    foreach (var prop in typeof(PredictionResult).GetProperties())
    {
        var value = prop.GetValue(prediction);
        if (value != null)
            nonNullData[prop.Name] = value;
    }

    // Log only the non-null properties being sent to the generator
    Console.WriteLine("🔮 Non-null properties sent to ResponseGenerator:");
    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(nonNullData,
        new System.Text.Json.JsonSerializerOptions { WriteIndented = true }));

    // Pass only the non-null values to ResponseGenerator
    string botReply = _responseGenerator.GenerateResponse(nonNullData, prediction.Intent);

    return Ok(new
    {
        Response = botReply,
        Prediction = nonNullData
    });
}


    }
}
