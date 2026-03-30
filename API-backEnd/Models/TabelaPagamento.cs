using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaPagamento
{
    public int Id { get; set; }

    public string Metodo { get; set; } = null!;

    public float Valor { get; set; }

    public int IdAluno { get; set; }

    public string Motivo { get; set; } = null!;

    public DateTime DataPagamento { get; set; }

    public virtual TabelaAluno IdAlunoNavigation { get; set; } = null!;
}
