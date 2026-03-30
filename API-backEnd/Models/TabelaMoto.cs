using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class TabelaMoto
{
    public int Id { get; set; }

    public int IdAluno { get; set; }

    public string Placa { get; set; } = null!;

    public string Modelo { get; set; } = null!;

    public string Marca { get; set; } = null!;

    public short Ano { get; set; }

    public string Cor { get; set; } = null!;

    public virtual TabelaAluno IdAlunoNavigation { get; set; } = null!;
}
