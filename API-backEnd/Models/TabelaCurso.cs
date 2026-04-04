using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaCurso
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public ulong IsAtivo { get; set; }

    public virtual ICollection<TabelaAluno> TabelaAlunos { get; set; } = new List<TabelaAluno>();

    public virtual ICollection<TabelaTurma> TabelaTurmas { get; set; } = new List<TabelaTurma>();
}
