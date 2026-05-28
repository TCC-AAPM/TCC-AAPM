using API_backEnd.Common;
using API_backEnd.DTOs.Turma;
using API_backEnd.Enums;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class TurmaService
    {
        private readonly AapmContext db;

        public TurmaService(AapmContext db)
        {
            this.db = db;
        }

        public ResultadoPadrao<List<TurmaResponse>> BuscarTurmasAtivas()
        {
            var turmas = db.TabelaTurmas
                .Where(c => c.IsAtivo)
                .Select(c => new TurmaResponse
                {
                    IdTurma = c.Id,
                    NomeTurma = c.Turma,
                    IdCurso = c.CursoId,
                    Periodo = Enum.Parse<PeriodoTurma>(c.Periodo),
                    SemestreInicio = c.SemestreInicio
                })
                .ToList();

            return ResultadoPadrao<List<TurmaResponse>>.Ok(turmas);
        }

        public ResultadoPadrao<List<TurmaPorCursoResponse>> BuscarTurmaPeloCurso(int idCurso)
        {
            var turmas = db.TabelaTurmas
                .Where(t => t.CursoId == idCurso && t.IsAtivo)
                .Select(t => new TurmaPorCursoResponse
                {
                    NomeCurso = t.Curso.Nome,
                    NomeTurma = t.Turma
                }).ToList();

            return ResultadoPadrao<List<TurmaPorCursoResponse>>.Ok(turmas);
        }

        public ResultadoPadrao<object> CriarTurma(CriarTurmaRequest dto)
        {
            var nomeTurma = dto.NomeTurma.Trim().ToUpper();

            var existe = db.TabelaTurmas.Any(t => t.Turma.ToUpper() == nomeTurma && t.IsAtivo);

            if (existe)
            {
                return ResultadoPadrao<object>.Falha("Turma ja existe", 409);
            }

            var turmaNew = new TabelaTurma
            {
                Turma = dto.NomeTurma,
                CursoId = dto.IdCurso,
                Periodo = dto.Periodo.ToString(),
                SemestreInicio = dto.SemestreInicio
            };

            db.TabelaTurmas.Add(turmaNew);
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok(mensagem: "Turma criada com sucesso");
        }

        public ResultadoPadrao<object> DeletarTurma(int idTurma)
        {
            var turma = db.TabelaTurmas.SingleOrDefault(t => t.Id == idTurma);

            if (turma == null)
            {
                return ResultadoPadrao<object>.Falha("Turma não encontrada", 404);
            }

            turma.IsAtivo = false;
            db.SaveChanges();

            return ResultadoPadrao<object>.Ok(mensagem: "Turma deletada com sucesso");
        }

        public ResultadoPadrao<object> EditarTurma(int idTurma, EditarTurmaRequest dto)
        {
            var turma = db.TabelaTurmas.SingleOrDefault(t => t.Id == idTurma);

            if (turma == null)
            {
                return ResultadoPadrao<object>.Falha("Turma não encontrado", 404);
            }
            var cursoExiste = db.TabelaCursos.Any(c => c.Id == dto.IdCurso);

            if (!cursoExiste)
            {
                return ResultadoPadrao<object>.Falha("Curso inválido", 404);
            }

            turma.Turma = dto.NomeTurma;
            turma.CursoId = dto.IdCurso;
            turma.Periodo = dto.Periodo.ToString();
            turma.SemestreInicio = dto.SemestreInicio;
            db.SaveChanges();

            return ResultadoPadrao<object>.Ok(mensagem: "Turma editada com sucesso");
        }
    }
}
