using API_backEnd.Common;
using API_backEnd.DTOs.Curso;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class CursoService
    {
        private readonly AapmContext db;
        public CursoService(AapmContext context)
        {
            db = context;
        }

        public ResultadoPadrao<List<CursoResponse>> BuscarCursoAtivo()
        {
            var cursos = db.TabelaCursos.Where(c => c.IsAtivo)
                .Select(c => new CursoResponse
                {
                    Id = c.Id,
                    Nome = c.Nome
                }).ToList();

            return ResultadoPadrao<List<CursoResponse>>.Ok(cursos);
        }

        public ResultadoPadrao<object> CriarCurso(CursoRequest dto) 
        {
            var nome = dto.Nome.Trim().ToUpper();
            var existe = db.TabelaCursos.Any(c => c.Nome.ToLower() == nome);

            if (existe)
            {
                return ResultadoPadrao<object>.Falha("Curso ja existe", 409);
            }
            var cursoNew = new TabelaCurso
            {
                Nome = dto.Nome.Trim()
            };
            db.TabelaCursos.Add(cursoNew);
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok(mensagem: "Curso criado com sucesso");
        }

        public ResultadoPadrao<object> DeletarCurso(int idCurso)
        {
            var curso = db.TabelaCursos.FirstOrDefault(c => c.Id == idCurso);

            if (curso == null)
            {
                return ResultadoPadrao<object>.Falha("Curso não encontrado", 404);
            }

            var turmaAtiva = db.TabelaTurmas.Any(t => t.CursoId == curso.Id && t.IsAtivo);

            if (turmaAtiva)
                return ResultadoPadrao<object>.Falha("Existe turmas ativas desse curso");

            var alunoAtivo = db.TabelaAlunos.Any(c => c.CursoId == curso.Id && c.IsAtivo);
            if (alunoAtivo)
                return ResultadoPadrao<object>.Falha("Existe aluno vinculado a esse curso");

            curso.IsAtivo = false;
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok(mensagem: "Curso deletado com sucesso");
        }

        public ResultadoPadrao<object> EditarCurso(int idCurso, CursoRequest dto)
        {
            var curso = db.TabelaCursos.FirstOrDefault(c => c.Id == idCurso);

            if (curso == null)
            {
                return ResultadoPadrao<object>.Falha("Curso não encontrado", 404);
            }

            curso.Nome = dto.Nome.Trim();
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok(mensagem: "Curso editado com sucesso");
        }
    }
}
