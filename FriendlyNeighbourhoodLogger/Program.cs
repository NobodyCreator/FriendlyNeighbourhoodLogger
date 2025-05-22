using Microsoft.EntityFrameworkCore;
using FriendlyNeighbourhoodLogger;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Adding services to the container for future reference
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=mediaTracker.db"));

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// builder.Services.AddAuthentication("Bearer")
//     .AddJwtBearer(options =>
//     {
//         options.Authority = "https://your-auth-provider.com";
//         options.Audience = "your-api-audience";
//         options.RequireHttpsMetadata = false;
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = false, 
//             ValidateAudience = false, 
//             ValidateLifetime = false, 
//             ValidateIssuerSigningKey = false
//         };
//     });

//.Services.AddAuthorization(); // 



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
   // ignore for now c.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection(); //remember to disable this when not devving
}



using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseRouting();
//app.UseAuthentication();
//app.UseAuthorization();

app.MapControllers();
app.UseRouting();

app.Run();