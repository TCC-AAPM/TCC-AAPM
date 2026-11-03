
# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["API-aapm.csproj", "./"]
RUN dotnet restore "API-aapm.csproj"

COPY . .
RUN dotnet publish "API-aapm.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

ENTRYPOINT ["dotnet", "API-aapm.dll"]
