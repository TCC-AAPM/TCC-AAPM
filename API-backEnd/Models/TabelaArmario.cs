using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaArmario
{
    public int NumeroArmario { get; set; }

    public string Estado { get; set; } = null!;

    public string? Observacao { get; set; }

    public ulong IsAtivo { get; set; }

    public virtual ICollection<TabelaReservaArmario> TabelaReservaArmarios { get; set; } = new List<TabelaReservaArmario>();
}
