using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_backEnd.Migrations
{
    /// <inheritdoc />
    public partial class AddMigrationCriarColunaIsAtivo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "config_reserva",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false),
                    data_expiracao_global = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_armario",
                columns: table => new
                {
                    numero_armario = table.Column<int>(type: "int(11)", nullable: false),
                    estado = table.Column<string>(type: "enum('D','O','M','A')", nullable: false, defaultValueSql: "'D'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    observacao = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.numero_armario);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_curso",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nome = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_usuario",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    senha = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    perfil = table.Column<string>(type: "enum('aluno','admin')", nullable: true, defaultValueSql: "'aluno'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAtivo = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_vagas_estacionamento",
                columns: table => new
                {
                    numero_vaga = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    estado = table.Column<string>(type: "enum('D','O','M')", nullable: false, defaultValueSql: "'D'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.numero_vaga);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_verificacao",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    codigo = table.Column<string>(type: "varchar(6)", maxLength: 6, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    expiracao = table.Column<DateTime>(type: "datetime", nullable: false),
                    usado = table.Column<bool>(type: "tinyint(1)", nullable: true, defaultValueSql: "'0'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_turma",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    turma = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    curso_id = table.Column<int>(type: "int(11)", nullable: false),
                    periodo = table.Column<string>(type: "enum('M','V','N','I')", nullable: true, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    semestre_inicio = table.Column<string>(type: "enum('1','2')", nullable: true, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ano_inicio = table.Column<short>(type: "year(4)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "tabela_turma_ibfk_1",
                        column: x => x.curso_id,
                        principalTable: "tabela_curso",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_admin",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    nome = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    telefone = table.Column<string>(type: "char(20)", fixedLength: true, maxLength: 20, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CPF = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    id_usuario = table.Column<int>(type: "int(11)", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "current_timestamp()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "FK_tabela_admin_tabela_usuario",
                        column: x => x.id_usuario,
                        principalTable: "tabela_usuario",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_alunos",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CPF = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    nome = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    matricula = table.Column<string>(type: "char(50)", fixedLength: true, maxLength: 50, nullable: true, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    telefone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false, collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    curso_id = table.Column<int>(type: "int(11)", nullable: false),
                    turma_id = table.Column<int>(type: "int(11)", nullable: false),
                    id_usuario = table.Column<int>(type: "int(11)", nullable: true),
                    criado_em = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "current_timestamp()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "FK_tabela_alunos_tabela_usuario",
                        column: x => x.id_usuario,
                        principalTable: "tabela_usuario",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "tabela_alunos_ibfk_1",
                        column: x => x.curso_id,
                        principalTable: "tabela_curso",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "tabela_alunos_ibfk_3",
                        column: x => x.turma_id,
                        principalTable: "tabela_turma",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_moto",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    id_aluno = table.Column<int>(type: "int(11)", nullable: false),
                    placa = table.Column<string>(type: "char(7)", fixedLength: true, maxLength: 7, nullable: false, defaultValueSql: "'0'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    modelo = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false, defaultValueSql: "'0'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    marca = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false, defaultValueSql: "'0'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ano = table.Column<short>(type: "year(4)", nullable: false, defaultValueSql: "'2000'"),
                    cor = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false, defaultValueSql: "'0'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "FK_tabela_moto_tabela_alunos",
                        column: x => x.id_aluno,
                        principalTable: "tabela_alunos",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_pagamento",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    metodo = table.Column<string>(type: "enum('C','D','P','A')", nullable: false, defaultValueSql: "'A'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    valor = table.Column<float>(type: "float", nullable: false),
                    id_aluno = table.Column<int>(type: "int(11)", nullable: false),
                    motivo = table.Column<string>(type: "enum('A','E','O')", nullable: false, defaultValueSql: "'A'", collation: "utf8mb4_uca1400_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    data_pagamento = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "current_timestamp()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "FK_tabela_pagamento_tabela_alunos",
                        column: x => x.id_aluno,
                        principalTable: "tabela_alunos",
                        principalColumn: "id");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_reserva_armario",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    id_aluno = table.Column<int>(type: "int(11)", nullable: false),
                    id_armario = table.Column<int>(type: "int(11)", nullable: false),
                    is_ativo = table.Column<ulong>(type: "bit(1)", nullable: false, defaultValueSql: "b'1'"),
                    criada_em = table.Column<DateTime>(type: "timestamp", nullable: false, defaultValueSql: "current_timestamp()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "FK__tabela_alunos",
                        column: x => x.id_aluno,
                        principalTable: "tabela_alunos",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tabela_reserva_armario_tabela_armario",
                        column: x => x.id_armario,
                        principalTable: "tabela_armario",
                        principalColumn: "numero_armario");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateTable(
                name: "tabela_reserva_estacionamento",
                columns: table => new
                {
                    id = table.Column<int>(type: "int(11)", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    id_aluno = table.Column<int>(type: "int(11)", nullable: true),
                    id_vaga = table.Column<int>(type: "int(11)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.id);
                    table.ForeignKey(
                        name: "FK_tabela_estacionamento_tabela_alunos",
                        column: x => x.id_aluno,
                        principalTable: "tabela_alunos",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK_tabela_reserva_estacionamento_tabela_vagas_estacionamento",
                        column: x => x.id_vaga,
                        principalTable: "tabela_vagas_estacionamento",
                        principalColumn: "numero_vaga");
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_uca1400_ai_ci");

            migrationBuilder.CreateIndex(
                name: "CPF",
                table: "tabela_admin",
                column: "CPF",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "FK_tabela_admin_tabela_usuario",
                table: "tabela_admin",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "CPF1",
                table: "tabela_alunos",
                column: "CPF",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "curso_id",
                table: "tabela_alunos",
                column: "curso_id");

            migrationBuilder.CreateIndex(
                name: "FK_tabela_alunos_tabela_usuario",
                table: "tabela_alunos",
                column: "id_usuario");

            migrationBuilder.CreateIndex(
                name: "matricula",
                table: "tabela_alunos",
                column: "matricula",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "tabela_usuario_ibfk_3",
                table: "tabela_alunos",
                column: "turma_id");

            migrationBuilder.CreateIndex(
                name: "FK_tabela_moto_tabela_alunos",
                table: "tabela_moto",
                column: "id_aluno");

            migrationBuilder.CreateIndex(
                name: "FK_tabela_pagamento_tabela_alunos",
                table: "tabela_pagamento",
                column: "id_aluno");

            migrationBuilder.CreateIndex(
                name: "FK__tabela_alunos",
                table: "tabela_reserva_armario",
                column: "id_aluno");

            migrationBuilder.CreateIndex(
                name: "FK_tabela_reserva_armario_tabela_armario",
                table: "tabela_reserva_armario",
                column: "id_armario");

            migrationBuilder.CreateIndex(
                name: "FK_tabela_estacionamento_tabela_alunos",
                table: "tabela_reserva_estacionamento",
                column: "id_aluno");

            migrationBuilder.CreateIndex(
                name: "FK_tabela_reserva_estacionamento_tabela_vagas_estacionamento",
                table: "tabela_reserva_estacionamento",
                column: "id_vaga");

            migrationBuilder.CreateIndex(
                name: "curso_id1",
                table: "tabela_turma",
                column: "curso_id");

            migrationBuilder.CreateIndex(
                name: "email",
                table: "tabela_verificacao",
                column: "email");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "config_reserva");

            migrationBuilder.DropTable(
                name: "tabela_admin");

            migrationBuilder.DropTable(
                name: "tabela_moto");

            migrationBuilder.DropTable(
                name: "tabela_pagamento");

            migrationBuilder.DropTable(
                name: "tabela_reserva_armario");

            migrationBuilder.DropTable(
                name: "tabela_reserva_estacionamento");

            migrationBuilder.DropTable(
                name: "tabela_verificacao");

            migrationBuilder.DropTable(
                name: "tabela_armario");

            migrationBuilder.DropTable(
                name: "tabela_alunos");

            migrationBuilder.DropTable(
                name: "tabela_vagas_estacionamento");

            migrationBuilder.DropTable(
                name: "tabela_usuario");

            migrationBuilder.DropTable(
                name: "tabela_turma");

            migrationBuilder.DropTable(
                name: "tabela_curso");
        }
    }
}
