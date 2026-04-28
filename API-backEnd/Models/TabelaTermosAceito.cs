using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaTermosAceito
{
    public int Id { get; set; }

    public int IdTermos { get; set; }

    public int IdUsuario { get; set; }

    public DateTime DataAceito { get; set; }

    public DateTime? DataAlteracao { get; set; }

    public bool IsAtivo { get; set; }

    public virtual TabelaTermo IdTermosNavigation { get; set; } = null!;

    public virtual TabelaUsuario IdUsuarioNavigation { get; set; } = null!;
}
