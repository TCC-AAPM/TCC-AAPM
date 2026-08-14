using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaAluno
{
    public int Id { get; set; }

    public string Cpf { get; set; } = null!;

    public string Nome { get; set; } = null!;

    public string? NomeSocial { get; set; }

    public string? Matricula { get; set; }

    public string Telefone { get; set; } = null!;

    public string Email { get; set; } = null!;

    public DateOnly DataNasc { get; set; }

    public int CursoId { get; set; }

    public int TurmaId { get; set; }

    public int IdUsuario { get; set; }

    public DateTime CriadoEm { get; set; }

    public bool IsAtivo { get; set; }

    public virtual TabelaCurso Curso { get; set; } = null!;

    public virtual TabelaUsuario IdUsuarioNavigation { get; set; } = null!;

    public virtual ICollection<TabelaPagamento> TabelaPagamentos { get; set; } = new List<TabelaPagamento>();

    public virtual ICollection<TabelaReservaArmario> TabelaReservaArmarios { get; set; } = new List<TabelaReservaArmario>();

    public virtual TabelaTurma? Turma { get; set; }
}
