using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaReservaArmario
{
    public int Id { get; set; }

    public int IdAluno { get; set; }

    public int IdArmario { get; set; }

    public ulong IsAtivo { get; set; }

    public DateTime CriadaEm { get; set; }

    public virtual TabelaAluno IdAlunoNavigation { get; set; } = null!;

    public virtual TabelaArmario IdArmarioNavigation { get; set; } = null!;
}
