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
                case "GetTotalPrice":
                    return "The total price is 10000 USD";
                case "GetTotalAmountPaid":
                    return "The total amount paid is 3000 USD";
                case "GetRemainingAmount":
                    return "The remaining amount is 7000 USD";
                case "GetTransactionStatus":
                    return "The transaction status is In Progress";
                case "GetItems":
                    return "The transaction contains 3 items: Item A, Item B, Item C";
                case "GetGrn":
                    return "The GRN number is GRN12345";
                case "GetPurchaseOrder":
                    return "The purchase order number is PO98765";
                case "GetContactPerson":
                    return "The contact person is John Doe";
                case "GetPurchaseCompany":
                    return "The purchase was made by Acme Corp";
                default:
                    return "Sorry, I didn’t understand that. Can you rephrase?";
            }
        }
    }
}
