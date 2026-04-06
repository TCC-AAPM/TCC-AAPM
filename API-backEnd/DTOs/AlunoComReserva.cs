namespace API_backEnd.DTOs
{
    public class AlunoComReserva
    {
        public string NomeAluno { get; set; }
        public int NumeroArmario { get; set; }
        public string Telefone { get; set; }
        public string CPF { get; set; }
        public string Email { get; set; }
        public string Curso { get; set; }
        public string Turma { get; set; }
        public string Pagamento { get; set; }
        public DateOnly DataExpiracao { get; set; }
    }
}
