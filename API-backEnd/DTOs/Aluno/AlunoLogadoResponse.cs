namespace API_backEnd.DTOs.Aluno
{
    public class AlunoLogadoResponse
    {
        public int NumeroArmario { get; set; }
        public string Nome { get; set; }
        public string CPF { get; set; }
        public string Telefone { get; set; }
        public string Matricula { get; set; }
        public string Email { get; set; }
        public string Turma { get; set; }
        public string Curso { get; set; }
        public string Pagamento { get; set; }
        public DateOnly DataExpiracao { get; set; }
    }
}
