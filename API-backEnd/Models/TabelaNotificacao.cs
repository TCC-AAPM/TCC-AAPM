using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaNotificacao
{
    public int Id { get; set; }

    public int IdUsuario { get; set; }

    public string Titulo { get; set; } = null!;

    public string Mensagem { get; set; } = null!;

    public string Tipo { get; set; } = null!;

    public bool Lida { get; set; }

    public DateTime DataCriacao { get; set; }

    public virtual TabelaUsuario IdUsuarioNavigation { get; set; } = null!;
}
