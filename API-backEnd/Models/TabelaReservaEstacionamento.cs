using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaReservaEstacionamento
{
    public int Id { get; set; }

    public int? IdAluno { get; set; }

    public int? IdVaga { get; set; }

    public virtual TabelaAluno? IdAlunoNavigation { get; set; }

    public virtual TabelaVagasEstacionamento? IdVagaNavigation { get; set; }
}
