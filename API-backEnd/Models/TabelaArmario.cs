using API_backEnd.Enums;
using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaArmario
{
    public int NumeroArmario { get; set; }

    public EstadoArmario Estado { get; set; }

    public string? Observacao { get; set; }

    public bool IsAtivo { get; set; }

    public virtual ICollection<TabelaReservaArmario> TabelaReservaArmarios { get; set; } = new List<TabelaReservaArmario>();
}
