import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main(){
    console.log("Populando o banco com dados mocados");

    //1- Limpar o banco:
    await prisma.reserva.deleteMany({});
    await prisma.usuario.deleteMany({});
    await prisma.sala.deleteMany({});

    console.log("Criando usuários");

    const admin = await prisma.usuario.create({
        data: {
            nome: "Carlos",
            email: "carlos@gmail.com",
            senha: "senhaForte123",
            eAdmin: true,
        },
    });

    const membro = await prisma.usuario.create({
    data: {
      nome: 'João Silva (Membro)',
      email: 'membro@coworking.com',
      senha: 'membro123',
      telefone: '11988888888',
      cpf: '987.654.321-99',
      eAdmin: false,
    },
  });

  console.log("Criando salas")

  const salaAuditorio = await prisma.sala.create({
    data: {
      nome: 'Sala Auditório',
      capacidade: 50,
      eDisponivel: true,
      descricao: 'Espaço amplo para palestras e eventos.',
      precoLocacao: 150.00,
    },
  });

  const salaReunioesA = await prisma.sala.create({
    data: {
      nome: 'Sala Reuniões A',
      capacidade: 10,
      eDisponivel: true,
      descricao: 'Sala de reuniões executiva com projetor.',
      precoLocacao: 70.00,
    },
  });

  const cabineIndividual = await prisma.sala.create({
    data: {
      nome: 'Cabine Individual',
      capacidade: 1,
      eDisponivel: true,
      descricao: 'Cabine privativa para chamadas de vídeo.',
      precoLocacao: 15.00,
    },
  });

  console.log("Criando reservas")

  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  amanha.setHours(0, 0, 0, 0); // Zera as horas, minutos e segundos (salva apenas a data base)

  await prisma.reserva.create({
    data: {
      idUsuario: membro.id,      // Associa a reserva ao ID do usuário 'membro' que acabamos de criar
      idSala: salaReunioesA.id,  // Associa a reserva ao ID da sala 'Sala Reuniões A'
      dia: amanha,
      turno: 'TARDE',            // Pode ser MANHA, TARDE ou NOITE
    },
  });

  console.log('🚀 Seed executado com sucesso! Banco populado e pronto.');

}

main()
  .then(async () => {
    // Após terminar com sucesso, desconecta o cliente do Prisma para liberar os recursos do banco
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Se ocorrer algum erro durante a execução, mostra o erro no console
    console.error('❌ Ocorreu um erro ao rodar o seed:', e);
    // Desconecta o cliente mesmo em caso de erro
    await prisma.$disconnect();
    // Encerra o processo do Node.js com código de erro 1
    process.exit(1);
  });