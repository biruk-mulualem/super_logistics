using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using server.Models; // <-- add this to access your models and context

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(); // <-- Add this to enable controller support

// Add DbContext with InMemory DB (for now)
builder.Services.AddDbContext<LogisticsContext>(options =>
    options.UseInMemoryDatabase("LogisticsDB"));

// Add CORS to allow Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient",
        policy =>
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader());
});

// Swagger services for API docs (keep this from your original)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowAngularClient");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers(); // <-- map controller routes

// Remove the weatherforecast MapGet since you won't need it anymore

app.Run();
