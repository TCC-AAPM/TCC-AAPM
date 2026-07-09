using API_backEnd.Common;
using API_backEnd.DTOs.ConfigReserva;
using API_backEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace API_backEnd.Services
{
    public class ConfigReservaService
    {
        private readonly AapmContext db;

        public ConfigReservaService(AapmContext _db)
        {
           this.db = _db;
        }


        public async Task<ResultadoPadrao<ConfigReserva>> AlterarDataFimSemestre(AlterarDataFimSemestreRequest dto)
        {
            var config = await db.ConfigReservas.FirstOrDefaultAsync();

            if (config == null)
                return ResultadoPadrao<ConfigReserva>.Falha("Configuração de reserva não encontrada.", 404);

            if (dto.DataFimSemestre < DateOnly.FromDateTime(DateTime.Today))
                return ResultadoPadrao<ConfigReserva>.Falha("A data de fim do semestre não pode ser anterior à data atual.");

            if (config.DataExpiracaoGlobal == dto.DataFimSemestre)
                return ResultadoPadrao<ConfigReserva>.Falha("A data informada já está cadastrada.");

            config.DataExpiracaoGlobal = dto.DataFimSemestre;

            await db.SaveChangesAsync();

            return ResultadoPadrao<ConfigReserva>.Ok(config, "Data de fim do semestre atualizada com sucesso.");
        }

    }
}
