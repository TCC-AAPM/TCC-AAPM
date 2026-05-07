using API_backEnd.Common;
using API_backEnd.DTOs.Admin;
using API_backEnd.DTOs.Auth;
using API_backEnd.Enums;
using API_backEnd.Models;

namespace API_backEnd.Services
{
    public class AdminService
    {
        private readonly AapmContext db;
        private readonly UsuarioService _usuarioService;
        private readonly IdadeService _idadeService;
        private readonly TermoService _termoService;
        public AdminService(AapmContext db, UsuarioService usuarioService, IdadeService idadeService, TermoService termoService) 
        {
            this.db = db;
            _usuarioService = usuarioService;
            _idadeService = idadeService;
            _termoService = termoService;
        }

       
        public ResultadoPadrao<AdminLogadoResponse> ObterAdminLogado()
        {
            var id = _usuarioService.ObterIdUsuarioLogado();

            var admin = db.TabelaAdmins.FirstOrDefault(a => a.IdUsuario == id && a.IsAtivo);

            if (admin == null)
            {
                return ResultadoPadrao<AdminLogadoResponse>.Falha("Admin não encontrado", 404);
            }

            var response = new AdminLogadoResponse
            {
                Nome = admin.Nome,
                Email = admin.Email,
                Telefone = admin.Telefone,
                CPF = admin.Cpf
            };

            return ResultadoPadrao<AdminLogadoResponse>.Ok(response);
        }

        public ResultadoPadrao<object> CriarAdmin(CriarAdminRequest dto)
        {
            var validarIdadeETermo = ValidarIdadeETermos(dto.DataNasc, dto.idTermoSite, dto.aceitouTermoSite, 14);
            if (!validarIdadeETermo.Sucesso)
                return validarIdadeETermo;

            var adminExiste = db.TabelaAdmins.Any(a => a.Cpf == dto.CPF && a.IsAtivo);

            if (adminExiste)
            {
                return ResultadoPadrao<object>.Falha("CPF ja cadastrado como admin", 409);
            }

            using var transaction = db.Database.BeginTransaction();

            try
            {
                var usuario = new TabelaUsuario
                {
                    Senha = BCrypt.Net.BCrypt.HashPassword(dto.CPF)
                };

                db.TabelaUsuarios.Add(usuario);
                db.SaveChanges();

                AceitarTermos(usuario.Id, dto.idTermoSite);

                var admin = new TabelaAdmin
                {
                    Nome = dto.Nome,
                    NomeSocial = string.IsNullOrWhiteSpace(dto.NomeSocial) ? null : dto.NomeSocial,
                    DataNasc = dto.DataNasc,
                    Email = dto.Email,
                    Telefone = dto.Telefone,
                    Cpf = dto.CPF,
                    IdUsuario = usuario.Id
                };

                db.TabelaAdmins.Add(admin);
                db.SaveChanges();

                transaction.Commit();

                return ResultadoPadrao<object>.Ok(mensagem: "Admin criado com sucesso");
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return ResultadoPadrao<object>.Falha("Erro ao criar admin", 500);
            }
        }

        public ResultadoPadrao<object> DeletarAdmin(int id, ConfirmarSenhaRequest dto)
        {
            var idUsuario = _usuarioService.ObterIdUsuarioLogado();

            var usuarioLogado = db.TabelaUsuarios.FirstOrDefault(u => u.Id == idUsuario);

            if (usuarioLogado == null)
            {
                return ResultadoPadrao<object>.Falha("Usuário logado não encontrado", 404);
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Senha, usuarioLogado.Senha))
            {
                return ResultadoPadrao<object>.Falha("Senha incorreta", 400);
            }


            var DelAdmin = db.TabelaAdmins.FirstOrDefault(a => a.Id == id && a.IsAtivo);

            if (DelAdmin == null)
            {
                return ResultadoPadrao<object>.Falha(
                    "Admin não encontrado",
                    404
                );
            }

            var DelUsuarioAdmin = db.TabelaUsuarios.FirstOrDefault(u => u.Id == DelAdmin.IdUsuario);

            if (DelUsuarioAdmin == null)
            {
                return ResultadoPadrao<object>.Falha("Usuário do admin não encontrado", 404);
            }

            if (DelAdmin.IdUsuario == usuarioLogado.Id)
            {
                return ResultadoPadrao<object>.Falha("Você não pode excluir a si mesmo", 400);
            }

            DelUsuarioAdmin.IsAtivo = false;
            DelAdmin.IsAtivo = false;
            db.SaveChanges();
            return ResultadoPadrao<object>.Ok(mensagem: "Admin excluído com sucesso");
        }

        private ResultadoPadrao<object> ValidarIdadeETermos(DateOnly dataNasc, int idTermoSite,
            bool aceitouTermoSite, int idadeMin)
        {
            var validacaoIdadeResultado = _idadeService.ValidarIdade(dataNasc, idadeMin);

            if (!validacaoIdadeResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(validacaoIdadeResultado.Mensagem, validacaoIdadeResultado.StatusCode);


            // validar o aceite do termo site com m
            var termoSiteResultado = _termoService.ValidarAceiteDeTermo(ReferenciaTermos.S, idTermoSite, aceitouTermoSite);

            if (!termoSiteResultado.Sucesso)
                return ResultadoPadrao<object>.Falha(termoSiteResultado.Mensagem, termoSiteResultado.StatusCode);

            return ResultadoPadrao<object>.Ok();
        }

        private void AceitarTermos(int idUsuario, int idTermoSite)
        {
            var aceiteTermoSite = _termoService.AceitarTermoSemSalvar(idUsuario, idTermoSite);
            if (!aceiteTermoSite.Sucesso)
                throw new Exception(aceiteTermoSite.Mensagem);
        }
    }
}
