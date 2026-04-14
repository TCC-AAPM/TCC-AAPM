using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaTermo
{
    public int Id { get; set; }

    public string Termos { get; set; } = null!;

    public string Referencia { get; set; } = null!;

    public DateTime DataCriacao { get; set; }

    public DateTime? DataAlteracao { get; set; }

    public bool IsAtivo { get; set; }

    public virtual ICollection<TabelaTermosAceito> TabelaTermosAceitos { get; set; } = new List<TabelaTermosAceito>();
}
