using Microsoft.EntityFrameworkCore;
using GymTecSQL_API.Models;

var builder = WebApplication.CreateBuilder(args);

// Configurar GymTecContext con cadena de conexion
builder.Services.AddDbContext<GymTecContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("GymTecConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
