using API_backEnd.Enums;
using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaTurma
{
    public int Id { get; set; }

    public string Turma { get; set; } = null!;

    public int CursoId { get; set; }

    public string Periodo { get; set; } = null!;

    public Semestre SemestreInicio { get; set; }

    public short? AnoInicio { get; set; }

    public bool IsAtivo { get; set; }

    public virtual TabelaCurso Curso { get; set; } = null!;

    public virtual ICollection<TabelaAluno> TabelaAlunos { get; set; } = new List<TabelaAluno>();
}
