using Microsoft.EntityFrameworkCore;
using server.Models; // <-- adjust as needed to match your actual namespace

namespace server
{
    // Main entry point for the application
    public class Program
    {
        public static void Main(string[] args)
        {
            // This creates a WebApplication builder to configure the services and the request pipeline
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container for the application
            builder.Services.AddControllers();
            // This registers your MVC controllers, which are responsible for handling HTTP requests.

            // Configure MySQL with your connection string (connecting to the database)
            builder.Services.AddDbContext<LogisticsContext>(options =>
                options.UseMySql(
                    builder.Configuration.GetConnectionString("DefaultConnection"), // Get the connection string from the config
                    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
                    // AutoDetect the version of MySQL from the connection string (helps in compatibility)
                )
            );

            // Enable CORS for Angular frontend (This allows cross-origin requests from your Angular app)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularClient", policy =>
                 policy.WithOrigins("http://localhost:4200") // or your deployed Angular URL
                          .AllowAnyMethod()   // Allow any HTTP method (GET, POST, PUT, DELETE, etc.)
                          .AllowAnyHeader()); // Allow any headers in the request (useful for authentication, content type, etc.)
            });
            // Add Swagger for API documentation (Swagger generates interactive API documentation)
            builder.Services.AddEndpointsApiExplorer(); // This adds API endpoint discovery
            builder.Services.AddSwaggerGen(); // Adds Swagger generation services for documentation

            // Now we build the application, which will handle requests
            var app = builder.Build();

            // Enable CORS in the HTTP pipeline using the policy defined earlier
            app.UseCors("AllowAngularClient");

            // Enable Swagger only in the development environment
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); // Enables the Swagger middleware to generate the API documentation
                app.UseSwaggerUI(); // Enables Swagger's UI to interact with the API from a browser
            }


            // Enable authorization middleware (necessary for handling authentication/authorization)
            app.UseAuthorization();

            // Map the controllers' routes (this means your API controllers can start responding to HTTP requests)
            app.MapControllers();

            // Finally, the application starts running and starts listening for incoming requests
            app.Run();
        }
    }
}
