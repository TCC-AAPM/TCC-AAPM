using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaAdmin
{
    public int Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Telefone { get; set; } = null!;

    public string? Cpf { get; set; }

    public int? IdUsuario { get; set; }

    public DateTime CriadoEm { get; set; }

    public bool IsAtivo { get; set; }

    public virtual TabelaUsuario? IdUsuarioNavigation { get; set; }
}
