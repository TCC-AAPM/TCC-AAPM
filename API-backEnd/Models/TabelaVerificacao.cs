using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaVerificacao
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string Codigo { get; set; } = null!;

    public DateTime Expiracao { get; set; }

    public bool? Usado { get; set; }
}
