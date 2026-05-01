using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace API_backEnd.Models;

public partial class AapmContext : DbContext
{
    public AapmContext()
    {
    }

    public AapmContext(DbContextOptions<AapmContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ConfigReserva> ConfigReservas { get; set; }

    public virtual DbSet<TabelaAdmin> TabelaAdmins { get; set; }

    public virtual DbSet<TabelaAluno> TabelaAlunos { get; set; }

    public virtual DbSet<TabelaArmario> TabelaArmarios { get; set; }

    public virtual DbSet<TabelaCurso> TabelaCursos { get; set; }

    public virtual DbSet<TabelaMoto> TabelaMotos { get; set; }

    public virtual DbSet<TabelaPagamento> TabelaPagamentos { get; set; }

    public virtual DbSet<TabelaProduto> TabelaProdutos { get; set; }

    public virtual DbSet<TabelaReservaArmario> TabelaReservaArmarios { get; set; }

    public virtual DbSet<TabelaReservaEstacionamento> TabelaReservaEstacionamentos { get; set; }

    public virtual DbSet<TabelaTermo> TabelaTermos { get; set; }

    public virtual DbSet<TabelaTermosAceito> TabelaTermosAceitos { get; set; }

    public virtual DbSet<TabelaTurma> TabelaTurmas { get; set; }

    public virtual DbSet<TabelaUsuario> TabelaUsuarios { get; set; }

    public virtual DbSet<TabelaVagasEstacionamento> TabelaVagasEstacionamentos { get; set; }

    public virtual DbSet<TabelaVerificacao> TabelaVerificacaos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=aapm;user=root;password=senai", Microsoft.EntityFrameworkCore.ServerVersion.Parse("12.2.2-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_uca1400_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<ConfigReserva>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("config_reserva");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.DataExpiracaoGlobal).HasColumnName("data_expiracao_global");
        });

        modelBuilder.Entity<TabelaAdmin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_admin");

            entity.HasIndex(e => e.Cpf, "CPF").IsUnique();

            entity.HasIndex(e => e.IdUsuario, "FK_tabela_admin_tabela_usuario");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Cpf)
                .HasMaxLength(20)
                .HasColumnName("CPF");
            entity.Property(e => e.CriadoEm)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("timestamp")
                .HasColumnName("criado_em");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.IdUsuario)
                .HasColumnType("int(11)")
                .HasColumnName("id_usuario");
            entity.Property(e => e.DataNasc)
                .HasColumnName("data_nasc")
                .HasColumnType("date");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Nome)
                .HasMaxLength(100)
                .HasColumnName("nome");
            entity.Property(e => e.NomeSocial)
                .HasMaxLength(100)
                .HasColumnName("nome_social");
            entity.Property(e => e.Telefone)
                .HasMaxLength(20)
                .IsFixedLength()
                .HasColumnName("telefone");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.TabelaAdmins)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_tabela_admin_tabela_usuario");
        });

        modelBuilder.Entity<TabelaAluno>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_alunos");

            entity.HasIndex(e => e.Cpf, "CPF").IsUnique();

            entity.HasIndex(e => e.IdUsuario, "FK_tabela_alunos_tabela_usuario");

            entity.HasIndex(e => e.CursoId, "curso_id");

            entity.HasIndex(e => e.Matricula, "matricula").IsUnique();

            entity.HasIndex(e => e.TurmaId, "tabela_usuario_ibfk_3");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Cpf)
                .HasMaxLength(20)
                .HasColumnName("CPF");
            entity.Property(e => e.CriadoEm)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("timestamp")
                .HasColumnName("criado_em");
            entity.Property(e => e.CursoId)
                .HasColumnType("int(11)")
                .HasColumnName("curso_id");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.IdUsuario)
                .HasColumnType("int(11)")
                .HasColumnName("id_usuario");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Matricula)
                .HasMaxLength(50)
                .IsFixedLength()
                .HasColumnName("matricula");
            entity.Property(e => e.DataNasc)
                .HasColumnName("data_nasc")
                .HasColumnType("date");               
            entity.Property(e => e.Nome)
                .HasMaxLength(100)
                .HasColumnName("nome");
            entity.Property(e => e.NomeSocial)
                .HasMaxLength(100)
                .HasColumnName("nome_social");
            entity.Property(e => e.Telefone)
                .HasMaxLength(20)
                .HasColumnName("telefone");
            entity.Property(e => e.TurmaId)
                .HasColumnType("int(11)")
                .HasColumnName("turma_id");

            entity.HasOne(d => d.Curso).WithMany(p => p.TabelaAlunos)
                .HasForeignKey(d => d.CursoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tabela_alunos_ibfk_1");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.TabelaAlunos)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_tabela_alunos_tabela_usuario");

            entity.HasOne(d => d.Turma).WithMany(p => p.TabelaAlunos)
                .HasForeignKey(d => d.TurmaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tabela_alunos_ibfk_3");
        });

        modelBuilder.Entity<TabelaArmario>(entity =>
        {
            entity.HasKey(e => e.NumeroArmario).HasName("PRIMARY");

            entity.ToTable("tabela_armario");

            entity.Property(e => e.NumeroArmario)
                .ValueGeneratedNever()
                .HasColumnType("int(11)")
                .HasColumnName("numero_armario");
            entity.Property(e => e.Estado)
                .HasDefaultValueSql("'D'")
                .HasColumnType("enum('D','O','M','R','P')")
                .HasColumnName("estado");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Observacao)
                .HasMaxLength(255)
                .HasColumnName("observacao");
        });

        modelBuilder.Entity<TabelaCurso>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_curso");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Nome)
                .HasMaxLength(100)
                .HasColumnName("nome");
        });

        modelBuilder.Entity<TabelaMoto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_moto");

            entity.HasIndex(e => e.IdAluno, "FK_tabela_moto_tabela_alunos");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Ano)
                .HasDefaultValueSql("'2000'")
                .HasColumnType("year(4)")
                .HasColumnName("ano");
            entity.Property(e => e.Cor)
                .HasMaxLength(50)
                .HasDefaultValueSql("'0'")
                .HasColumnName("cor");
            entity.Property(e => e.IdAluno)
                .HasColumnType("int(11)")
                .HasColumnName("id_aluno");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Marca)
                .HasMaxLength(50)
                .HasDefaultValueSql("'0'")
                .HasColumnName("marca");
            entity.Property(e => e.Modelo)
                .HasMaxLength(50)
                .HasDefaultValueSql("'0'")
                .HasColumnName("modelo");
            entity.Property(e => e.Placa)
                .HasMaxLength(7)
                .HasDefaultValueSql("'0'")
                .IsFixedLength()
                .HasColumnName("placa");

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.TabelaMotos)
                .HasForeignKey(d => d.IdAluno)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tabela_moto_tabela_alunos");
        });

        modelBuilder.Entity<TabelaPagamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_pagamento");

            entity.HasIndex(e => e.IdAluno, "FK_tabela_pagamento_tabela_alunos");

            entity.HasIndex(e => e.IdProduto, "FK_tabela_pagamento_tabela_produto");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.DataPagamento)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("data_pagamento");
            entity.Property(e => e.IdAluno)
                .HasColumnType("int(11)")
                .HasColumnName("id_aluno");
            entity.Property(e => e.IdProduto)
                .HasColumnType("int(11)")
                .HasColumnName("id_produto");
            entity.Property(e => e.Metodo)
                .HasDefaultValueSql("'A'")
                .HasColumnType("enum('C','D','P','A')")
                .HasColumnName("metodo");

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.TabelaPagamentos)
                .HasForeignKey(d => d.IdAluno)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tabela_pagamento_tabela_alunos");

            entity.HasOne(d => d.IdProdutoNavigation).WithMany(p => p.TabelaPagamentos)
                .HasForeignKey(d => d.IdProduto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tabela_pagamento_tabela_produto");
        });

        modelBuilder.Entity<TabelaProduto>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_produto");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Preco)
                .HasPrecision(20, 6)
                .HasColumnName("preco");
            entity.Property(e => e.Produto)
                .HasColumnType("enum('A','E','O')")
                .HasColumnName("produto");
        });

        modelBuilder.Entity<TabelaReservaArmario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_reserva_armario");

            entity.HasIndex(e => e.IdAluno, "FK__tabela_alunos");

            entity.HasIndex(e => e.IdArmario, "FK_tabela_reserva_armario_tabela_armario");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.CriadaEm)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("timestamp")
                .HasColumnName("criada_em");
            entity.Property(e => e.IdAluno)
                .HasColumnType("int(11)")
                .HasColumnName("id_aluno");
            entity.Property(e => e.IdArmario)
                .HasColumnType("int(11)")
                .HasColumnName("id_armario");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.TabelaReservaArmarios)
                .HasForeignKey(d => d.IdAluno)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tabela_alunos");

            entity.HasOne(d => d.IdArmarioNavigation).WithMany(p => p.TabelaReservaArmarios)
                .HasForeignKey(d => d.IdArmario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tabela_reserva_armario_tabela_armario");
        });

        modelBuilder.Entity<TabelaReservaEstacionamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_reserva_estacionamento");

            entity.HasIndex(e => e.IdAluno, "FK_tabela_estacionamento_tabela_alunos");

            entity.HasIndex(e => e.IdVaga, "FK_tabela_reserva_estacionamento_tabela_vagas_estacionamento");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.IdAluno)
                .HasColumnType("int(11)")
                .HasColumnName("id_aluno");
            entity.Property(e => e.IdVaga)
                .HasColumnType("int(11)")
                .HasColumnName("id_vaga");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");

            entity.HasOne(d => d.IdAlunoNavigation).WithMany(p => p.TabelaReservaEstacionamentos)
                .HasForeignKey(d => d.IdAluno)
                .HasConstraintName("FK_tabela_estacionamento_tabela_alunos");

            entity.HasOne(d => d.IdVagaNavigation).WithMany(p => p.TabelaReservaEstacionamentos)
                .HasForeignKey(d => d.IdVaga)
                .HasConstraintName("FK_tabela_reserva_estacionamento_tabela_vagas_estacionamento");
        });

        modelBuilder.Entity<TabelaTermo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_termos");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.DataAlteracao)
                .HasColumnType("datetime")
                .HasColumnName("data_alteracao");
            entity.Property(e => e.DataCriacao)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("data_criacao");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Referencia)
                .HasDefaultValueSql("'A'")
                .HasColumnType("enum('A','E','S')")
                .HasColumnName("referencia");
            entity.Property(e => e.CaminhoPdf)
                .HasColumnType("varchar(255)")
                .HasColumnName("caminho_pdf");
        });

        modelBuilder.Entity<TabelaTermosAceito>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_termos_aceito");

            entity.HasIndex(e => e.IdTermos, "FK__tabela_termos");

            entity.HasIndex(e => e.IdUsuario, "FK_tabela_termos_aceito_tabela_usuario");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.DataAceito)
                .HasDefaultValueSql("current_timestamp()")
                .HasColumnType("datetime")
                .HasColumnName("data_aceito");
            entity.Property(e => e.DataAlteracao)
                .HasColumnType("datetime")
                .HasColumnName("data_alteracao");
            entity.Property(e => e.IdTermos)
                .HasColumnType("int(11)")
                .HasColumnName("id_termos");
            entity.Property(e => e.IdUsuario)
                .HasColumnType("int(11)")
                .HasColumnName("id_usuario");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");

            entity.HasOne(d => d.IdTermosNavigation).WithMany(p => p.TabelaTermosAceitos)
                .HasForeignKey(d => d.IdTermos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__tabela_termos");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.TabelaTermosAceitos)
                .HasForeignKey(d => d.IdUsuario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_tabela_termos_aceito_tabela_usuario");
        });

        modelBuilder.Entity<TabelaTurma>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_turma");

            entity.HasIndex(e => e.CursoId, "curso_id");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.AnoInicio)
                .HasColumnType("year(4)")
                .HasColumnName("ano_inicio");
            entity.Property(e => e.CursoId)
                .HasColumnType("int(11)")
                .HasColumnName("curso_id");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Periodo)
                .HasDefaultValueSql("'M'")
                .HasColumnType("enum('M','V','N','I')")
                .HasColumnName("periodo");
            entity.Property(e => e.SemestreInicio)
                .HasDefaultValueSql("'P'")
                .HasColumnType("enum('P','S')")
                .HasColumnName("semestre_inicio");
            entity.Property(e => e.Turma)
                .HasMaxLength(100)
                .HasColumnName("turma");

            entity.HasOne(d => d.Curso).WithMany(p => p.TabelaTurmas)
                .HasForeignKey(d => d.CursoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("tabela_turma_ibfk_1");
        });

        modelBuilder.Entity<TabelaUsuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_usuario");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
            entity.Property(e => e.Perfil)
                .HasDefaultValueSql("'aluno'")
                .HasColumnType("enum('aluno','admin')")
                .HasColumnName("perfil");
            entity.Property(e => e.Senha)
                .HasMaxLength(255)
                .HasColumnName("senha");
        });

        modelBuilder.Entity<TabelaVagasEstacionamento>(entity =>
        {
            entity.HasKey(e => e.NumeroVaga).HasName("PRIMARY");

            entity.ToTable("tabela_vagas_estacionamento");

            entity.Property(e => e.NumeroVaga)
                .HasColumnType("int(11)")
                .HasColumnName("numero_vaga");
            entity.Property(e => e.Estado)
                .HasDefaultValueSql("'D'")
                .HasColumnType("enum('D','O','M')")
                .HasColumnName("estado");
            entity.Property(e => e.IsAtivo)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)")
                .HasColumnName("is_ativo");
        });

        modelBuilder.Entity<TabelaVerificacao>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("tabela_verificacao");

            entity.HasIndex(e => e.Email, "email");

            entity.Property(e => e.Id)
                .HasColumnType("int(11)")
                .HasColumnName("id");
            entity.Property(e => e.Codigo)
                .HasMaxLength(6)
                .HasColumnName("codigo");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Expiracao)
                .HasColumnType("datetime")
                .HasColumnName("expiracao");
            entity.Property(e => e.Usado)
                .HasDefaultValueSql("'0'")
                .HasColumnName("usado");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
