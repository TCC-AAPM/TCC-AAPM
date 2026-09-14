using API_backEnd.Enums;
using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaProduto
{
    public int Id { get; set; }

    public CategoriaProduto Produto { get; set; }

    public decimal Preco { get; set; }

    public bool IsAtivo { get; set; }

    public virtual ICollection<TabelaPagamento> TabelaPagamentos { get; set; } = new List<TabelaPagamento>();
}
