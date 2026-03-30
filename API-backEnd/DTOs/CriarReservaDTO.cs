namespace API_backEnd.DTOs
{
    public class CriarReservaDTO
    {
        public int IdAluno { get; set; }
        public int IdArmario { get; set; }
        public string CPF { get; set; }
        public string Nome { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string Matricula { get; set; }
        public int IdCurso { get; set; }
        public int IdTurma { get; set; }
        public string Periodo { get; set; }
        public string Pagamento { get; set; }
        public string MetodoPagamento { get; set; }

    }
}
