using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaNotificacao
{
    public int Id { get; set; }

    public string Titulo { get; set; } = null!;

    public string Mensagem { get; set; } = null!;

    public string Evento { get; set; } = null!;

    public bool IsAtivo { get; set; }

    public virtual ICollection<TabelaHistoricoNotificacao> TabelaHistoricoNotificacaos { get; set; } = new List<TabelaHistoricoNotificacao>();
}
