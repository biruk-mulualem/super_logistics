using server.Models;
using server.Services;
namespace server.Services
{
    public class ResponseGenerator
    {
        // Generate bot response based on predicted intent
        public string GenerateResponse(string intent)
        {
            switch (intent)
            {
                case "GetTransactionStatus":
                    return "I can help you track your shipment. Please provide your order number.";
                case "GetTotalPrice":
                    return "Let me check the ETA for your order.";
                case "GetTotalAmountPaid":
                    return "Let me find out when it will arrive at the factory.";
                case "GetContactPerson":
                    return "Here are the details of the item in your shipment.";
                case "Help":
                    return "You can ask me about shipment status, delivery times, and more.";
                default:
                    return "Sorry, I didn’t understand that. Can you rephrase?";
            }
        }
    }
}
