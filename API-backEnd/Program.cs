using API_backEnd.Models;
using API_backEnd.Services;
using API_backEnd.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings")
);

builder.Services.AddScoped<EmailService>();
// 🔹 Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// 🔹 Swagger + JWT
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.OrderActionsBy(apiDesc =>
    {
        var methodOrder = apiDesc.HttpMethod switch
        {
            "GET" => "1",
            "POST" => "2",
            "PUT" => "3",
            "DELETE" => "4",
            _ => "5"
        };

        return methodOrder;
    });
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AAPM API",
        Version = "v1.0",
        Description = """
        
        API para gerenciamento de armários, estacionamentos e alunos
        

        Desenvolvido por Gabriel Duarte
        
        """,
        Contact = new OpenApiContact
        {
            Name = "Gabriel Duarte"
        }
    });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Digite o token JWT sem 'Bearer'"
    });
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);

    options.IncludeXmlComments(xmlPath);

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
// 🔹 DbContext
builder.Services.AddDbContext<AapmContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// services

builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<AlunoService>();
builder.Services.AddScoped<ArmarioService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CadastroService>();
builder.Services.AddScoped<ConfigReservaService>();
builder.Services.AddScoped<CursoService>();
builder.Services.AddScoped<FinanceiroService>();
builder.Services.AddScoped<IdadeService>();
builder.Services.AddScoped<ProdutoService>();
builder.Services.AddScoped<ReservaService>();
builder.Services.AddScoped<TermoService>();
builder.Services.AddScoped<TurmaService>();
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddHttpContextAccessor();

// 🔹 JWT Authentication
var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

// 🔹 Swagger
app.UseSwagger();
app.UseSwaggerUI();

// arquivo
app.UseStaticFiles();

// 🔹 Pipeline
app.UseAuthentication(); // ⚠️ sempre antes

app.Use(async (context, next) =>
{
    context.Response.OnStarting(() =>
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            context.Response.Headers.CacheControl = "no-store, no-cache, must-revalidate";
            context.Response.Headers.Pragma = "no-cache";
            context.Response.Headers.Expires = "0";
        }

        return Task.CompletedTask;
    });

    await next();
});

app.UseAuthorization();

app.MapControllers();

app.Run();
