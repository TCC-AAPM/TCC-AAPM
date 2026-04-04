using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaProduto
{
    public int Id { get; set; }

    public string? Produto { get; set; }

    public decimal? Preco { get; set; }

    public ulong IsAtivo { get; set; }

    public virtual ICollection<TabelaPagamento> TabelaPagamentos { get; set; } = new List<TabelaPagamento>();
}
