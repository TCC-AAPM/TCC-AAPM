using System.Text.Json.Serialization;

namespace API_backEnd.DTOs.Pagamento
{
    public class PixQrCodeResponse
    {
        [JsonPropertyName("success")]
        public bool Sucesso { get; set; }

        [JsonPropertyName("encodedImage")]
        public string EncodedImage { get; set; }

        [JsonPropertyName("payload")]
        public string Payload { get; set; }

        [JsonPropertyName("expirationDate")]
        public string ExpirationDate { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }
    }
}
