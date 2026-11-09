using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaUsuario
{
    public int Id { get; set; }

    public string? Senha { get; set; }

    public string? Perfil { get; set; }

    public string? Auth0Id { get; set; }

    public bool IsAtivo { get; set; }

    public virtual ICollection<TabelaAdmin> TabelaAdmins { get; set; } = new List<TabelaAdmin>();

    public virtual ICollection<TabelaAluno> TabelaAlunos { get; set; } = new List<TabelaAluno>();

    public virtual ICollection<TabelaHistoricoNotificacao> TabelaHistoricoNotificacaos { get; set; } = new List<TabelaHistoricoNotificacao>();

    public virtual ICollection<TabelaTermosAceito> TabelaTermosAceitos { get; set; } = new List<TabelaTermosAceito>();
}
