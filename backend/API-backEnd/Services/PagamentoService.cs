using API_backEnd.DTOs.Pagamento;
using API_backEnd.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace API_backEnd.Services
{
    public class PagamentoService
    {


        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly AapmContext _db; 

        public PagamentoService(HttpClient httpClient, IConfiguration configuration, AapmContext db)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _db = db;
        }


        public async Task<string> CriarClienteAsaas(int idAluno)
        {
            var aluno = await _db.TabelaAlunos.FirstOrDefaultAsync(a => a.Id == idAluno && a.IsAtivo);

            if (aluno == null)
                throw new Exception("Aluno não encontrado ou inativo.");

            if (!string.IsNullOrWhiteSpace(aluno.IdClienteAsaas))
                return aluno.IdClienteAsaas;

            var dados = new
            {
                name = aluno.NomeSocial ?? aluno.Nome,
                cpfCnpj = aluno.Cpf,
                email = aluno.Email,
                mobilePhone = aluno.Telefone
            };

            var apiKey = _configuration["Asaas:ApiKey"];

            using var request = new HttpRequestMessage(HttpMethod.Post, "customers");

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new Exception("Chave da API Asaas não configurada.");

            request.Headers.Add("access_token", apiKey);
            request.Headers.UserAgent.ParseAdd("AAPM/1.0");

            request.Content = new StringContent
                (
                    JsonSerializer.Serialize(dados),
                    Encoding.UTF8,
                    "application/json"
                );

            var response = await _httpClient.SendAsync(request);
            var resultado = await response.Content.ReadAsStringAsync();

            if(!response.IsSuccessStatusCode)
                throw new Exception($"Erro ao criar cliente na Asaas: {resultado}");

            using var documento = JsonDocument.Parse(resultado);

            var idCliente = documento.RootElement.GetProperty("id").GetString();

            if (string.IsNullOrWhiteSpace(idCliente))
                throw new Exception("A Asaas não retornou o ID do cliente.");

            aluno.IdClienteAsaas = idCliente;

            await _db.SaveChangesAsync();

            return idCliente;
        }

        public async Task<AsaasPagamentoResponse>  CriarCobrancaPix(int idAluno, int idProduto)
        {
            var aluno = await _db.TabelaAlunos.FirstOrDefaultAsync(a => a.Id == idAluno && a.IsAtivo);

            if (aluno == null)
                throw new Exception("Aluno não encontrado ou inativo.");

            var produto = await _db.TabelaProdutos.FirstOrDefaultAsync(p => p.Id == idProduto && p.IsAtivo);

            if (produto == null)
                throw new Exception("Produto não encontrado ou inativo.");

            var idCliente = await CriarClienteAsaas(idAluno);


            var dados = new
            {
                customer = idCliente,
                billingType = "PIX",
                value = produto.Preco,
                dueDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd"),
                description = $"Pagamento AAPM - {produto.Produto}",
                externalReference = Guid.NewGuid().ToString()
            };

            var apiKey = _configuration["Asaas:ApiKey"];

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new Exception("Chave da API Asaas não configurada.");

            using var request = new HttpRequestMessage
                (
                    HttpMethod.Post,
                    "payments"
                );

            request.Headers.Add("access_token", apiKey);
            request.Headers.UserAgent.ParseAdd("AAPM/1.0");

            request.Content = new StringContent
                (
                    JsonSerializer.Serialize(dados),
                    Encoding.UTF8,
                    "application/json"
                );

            var response = await _httpClient.SendAsync(request);
            var resultado = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Erro ao criar cobrança: {resultado}");

            var pagamento = JsonSerializer.Deserialize<AsaasPagamentoResponse>(resultado);

            if (pagamento == null || string.IsNullOrWhiteSpace(pagamento.Id))
                throw new Exception("A Asaas não retornou os dados da cobrança.");

            return pagamento;
        }

    }
}
