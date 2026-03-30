using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaUsuario
{
    public int Id { get; set; }

    public string? Senha { get; set; }

    public string? Perfil { get; set; }

    public virtual ICollection<TabelaAdmin> TabelaAdmins { get; set; } = new List<TabelaAdmin>();

    public virtual ICollection<TabelaAluno> TabelaAlunos { get; set; } = new List<TabelaAluno>();
}
