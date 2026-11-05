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

// ==========================================
// PORTA DO RENDER
// ==========================================
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";

builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ==========================================
// EMAIL SETTINGS
// ==========================================
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings")
);

builder.Services.AddScoped<EmailService>();

// ==========================================
// CONTROLLERS
// ==========================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

// ==========================================
// SWAGGER + JWT
// ==========================================
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

    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }

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
            Array.Empty<string>()
        }
    });
});

// ==========================================
// BANCO DE DADOS - MARIADB / HOSTINGER
// ==========================================
var connectionString = builder.Configuration
    .GetConnectionString("DefaultConnection");

var dbInfo = new MySqlConnector.MySqlConnectionStringBuilder(connectionString);

Console.WriteLine(
    $"[DB CONFIG] Server={dbInfo.Server}; " +
    $"Database={dbInfo.Database}; " +
    $"User={dbInfo.UserID}"
);

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "A ConnectionString 'DefaultConnection' não foi configurada."
    );
}

builder.Services.AddDbContext<AapmContext>(options =>
    options.UseMySql(
        connectionString,

        // Evita AutoDetect, que tenta conectar ao banco durante a inicialização.
        new MariaDbServerVersion(new Version(10, 6, 0)),

        mysqlOptions =>
        {
            mysqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null
            );
        }
    )
);

// ==========================================
// SERVICES
// ==========================================
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<AlunoService>();
builder.Services.AddScoped<ArmarioService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<CadastroService>();
builder.Services.AddScoped<ConfigReservaService>();
builder.Services.AddScoped<CursoService>();
builder.Services.AddScoped<FinanceiroService>();
builder.Services.AddScoped<IdadeService>();
builder.Services.AddScoped<NotificacaoService>();
builder.Services.AddScoped<ProdutoService>();
builder.Services.AddScoped<ReservaService>();
builder.Services.AddScoped<TermoService>();
builder.Services.AddScoped<TurmaService>();
builder.Services.AddScoped<UsuarioService>();

builder.Services.AddHttpContextAccessor();

// ==========================================
// JWT AUTHENTICATION
// ==========================================
var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "A chave JWT não foi configurada. Configure Jwt__Key no Render."
    );
}

var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
        JwtBearerDefaults.AuthenticationScheme;

    options.DefaultChallengeScheme =
        JwtBearerDefaults.AuthenticationScheme;
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


// ==========================================
// BUILD APPLICATION
// ==========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontEndPolicy", policy =>
    {
        policy
            .WithOrigins(
                "https://aapm.dev",
                "https://www.aapm.dev"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("FrontEndPolicy");
// ==========================================
// SWAGGER
// ==========================================
app.UseSwagger();
app.UseSwaggerUI();

// ==========================================
// STATIC FILES
// ==========================================
app.UseStaticFiles();

// ==========================================
// AUTHENTICATION
// ==========================================
app.UseAuthentication();

// ==========================================
// CACHE HEADERS PARA USUÁRIOS AUTENTICADOS
// ==========================================
app.Use(async (context, next) =>
{
    context.Response.OnStarting(() =>
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            context.Response.Headers.CacheControl =
                "no-store, no-cache, must-revalidate";

            context.Response.Headers.Pragma = "no-cache";
            context.Response.Headers.Expires = "0";
        }

        return Task.CompletedTask;
    });

    await next();
});

// ==========================================
// AUTHORIZATION
// ==========================================
app.UseAuthorization();

// ==========================================
// ROUTES
// ==========================================
app.MapControllers();

// ==========================================
// RUN
// ==========================================
app.Run();