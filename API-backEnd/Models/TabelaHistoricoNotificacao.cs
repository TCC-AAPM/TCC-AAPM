using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaHistoricoNotificacao
{
    public int Id { get; set; }

    public int IdUsuario { get; set; }

    public int IdNotificacao { get; set; }

    public DateTime DataEnvio { get; set; }

    public bool Lida { get; set; }

    public virtual TabelaNotificacao IdNotificacaoNavigation { get; set; } = null!;

    public virtual TabelaUsuario IdUsuarioNavigation { get; set; } = null!;
}
