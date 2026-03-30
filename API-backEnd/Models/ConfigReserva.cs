using System;
using System.Collections.Generic;

namespace API_backEnd.Models;

public partial class ConfigReserva
{
    public int Id { get; set; }

    public DateOnly DataExpiracaoGlobal { get; set; }
}
