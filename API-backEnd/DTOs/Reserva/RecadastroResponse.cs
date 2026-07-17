namespace API_backEnd.DTOs.Reserva
{
    public class RecadastroResponse
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string? NomeSocial { get; set; }
        public DateOnly DataNasc { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string? Matricula { get; set; }
        public int IdCurso { get; set; }
        public int IdTurma { get; set; }
    }
}
