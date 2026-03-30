using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaVagasEstacionamento
{
    public int NumeroVaga { get; set; }

    public string Estado { get; set; } = null!;

    public virtual ICollection<TabelaReservaEstacionamento> TabelaReservaEstacionamentos { get; set; } = new List<TabelaReservaEstacionamento>();
}
