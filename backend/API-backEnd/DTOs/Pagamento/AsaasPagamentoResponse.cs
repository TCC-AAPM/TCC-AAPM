using System.Text.Json.Serialization;

namespace API_backEnd.DTOs.Pagamento
{
    public class AsaasPagamentoResponse
    {
        [JsonPropertyName("object")]
        public string Object { get; set; }

        [JsonPropertyName("id")]
        public string Id { get; set; }

        [JsonPropertyName("dateCreated")]
        public string DataCriacao { get; set; }

        [JsonPropertyName("customer")]
        public string Customer { get; set; }

        [JsonPropertyName("value")]
        public decimal Valor { get; set; }

        [JsonPropertyName("netValue")]
        public decimal ValorLiquido { get; set; }

        [JsonPropertyName("description")]
        public string Descricao { get; set; }

        [JsonPropertyName("billingType")]
        public string TipoCobranca { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("dueDate")]
        public string DataVencimento { get; set; }

        [JsonPropertyName("invoiceUrl")]
        public string UrlFatura { get; set; }

        [JsonPropertyName("invoiceNumber")]
        public string NumeroFatura { get; set; }

        [JsonPropertyName("externalReference")]
        public string ReferenciaExterna { get; set; }
    }
}
