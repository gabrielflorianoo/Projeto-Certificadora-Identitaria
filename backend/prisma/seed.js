import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Limpar dados existentes
    await prisma.grade.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.class.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.workshop.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuário admin
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await prisma.user.create({
        data: {
            name: "Administrador",
            email: "admin@example.com",
            password: hashedPassword,
            role: "ADMIN",
            phone: "43999990000",
            dateOfBirth: new Date("1985-01-15T00:00:00.000Z"),
            age: 39
        },
    });

    // Criar professores
    const teacher1 = await prisma.user.create({
        data: {
            name: "Prof. João Silva",
            email: "joao@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "TEACHER",
            phone: "43988881111",
            dateOfBirth: new Date("1978-05-20T00:00:00.000Z"),
            age: 46
        },
    });

    const teacher2 = await prisma.user.create({
        data: {
            name: "Prof. Maria Santos",
            email: "maria@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "TEACHER",
            phone: "43977772222",
            dateOfBirth: new Date("1982-11-10T00:00:00.000Z"),
            age: 42
        },
    });

    // Criar estudantes
    const student1 = await prisma.user.create({
        data: {
            name: "Ana Costa",
            email: "ana@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "STUDENT",
            phone: "43955554444",
            dateOfBirth: new Date("2000-07-25T00:00:00.000Z"),
            age: 24
        },
    });

    const student2 = await prisma.user.create({
        data: {
            name: "Carlos Oliveira",
            email: "carlos@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "STUDENT",
            phone: "43944445555",
            dateOfBirth: new Date("2001-09-12T00:00:00.000Z"),
            age: 23
        },
    });

    // Criar voluntários
    const volunteer1 = await prisma.user.create({
        data: {
            name: "Beatriz Lima",
            email: "beatriz@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "VOLUNTEER",
            phone: "43933336666",
            dateOfBirth: new Date("1995-02-18T00:00:00.000Z"),
            age: 29
        },
    });

    // Criar workshops
    const workshop1 = await prisma.workshop.create({
        data: {
            title: "Desenvolvimento Web Básico",
            description: "Aprenda os fundamentos de HTML, CSS e JavaScript",
            startDate: new Date("2024-02-01T08:00:00.000Z"),
            endDate: new Date("2024-04-30T17:00:00.000Z"),
            maxParticipants: 20,
            semester: "2024.1",
            location: "UTFPR, Sala 101, Bloco A", 
            modality: "PRESENCIAL",
        },
    });

    const workshop2 = await prisma.workshop.create({
        data: {
            title: "Python para Iniciantes",
            description: "Introdução à programação com Python",
            startDate: new Date("2024-03-01T09:00:00.000Z"),
            endDate: new Date("2024-05-31T18:00:00.000Z"),
            maxParticipants: 15,
            semester: "2024.1",
            location: "Online (Plataforma Moodle)",
            modality: "ONLINE",
        },
    });

    // Criar matrículas
    await prisma.enrollment.create({
        data: {
            userId: student1.id,
            workshopId: workshop1.id,
            status: "ATTENDING",
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: student1.id,
            workshopId: workshop2.id,
            status: "APPROVED",
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: student2.id,
            workshopId: workshop1.id,
            status: "CANCELED",
        },
    });

    // Criar aulas
    const class1 = await prisma.class.create({
        data: {
            workshopId: workshop1.id,
            date: new Date("2024-02-05T10:00:00.000Z"),
            subject: "Introdução ao HTML",
            taughtById: teacher1.id,
        },
    });

    const class2 = await prisma.class.create({
        data: {
            workshopId: workshop1.id,
            date: new Date("2024-02-12T10:00:00.000Z"),
            subject: "CSS Básico",
            taughtById: teacher1.id,
        },
    });

    const class3 = await prisma.class.create({
        data: {
            workshopId: workshop2.id,
            date: new Date("2024-03-05T14:00:00.000Z"),
            subject: "Variáveis e Tipos de Dados",
            taughtById: teacher2.id,
        },
    });

    // Criar presenças
    await prisma.attendance.create({
        data: {
            userId: student1.id,
            classId: class1.id,
            present: true,
        },
    });

    await prisma.attendance.create({
        data: {
            userId: student2.id,
            classId: class1.id,
            present: true,
        },
    });

    await prisma.attendance.create({
        data: {
            userId: student1.id,
            classId: class2.id,
            present: false,
        },
    });

    // Criar notas
    await prisma.grade.create({
        data: {
            userId: student1.id,
            classId: class1.id,
            grade: 8.5,
            notes: "Bom desempenho na primeira aula",
            assessmentType: "PARTICIPATION",
            weight: 0.2,
        },
    });

    await prisma.grade.create({
        data: {
            userId: student2.id,
            classId: class1.id,
            grade: 9.0,
            notes: "Excelente participação",
            assessmentType: "PARTICIPATION",
            weight: 0.2,
        },
    });

    await prisma.grade.create({
        data: {
            userId: student1.id,
            workshopId: workshop1.id,
            grade: 7.8,
            notes: "Nota final do projeto de Web Básico",
            assessmentType: "FINAL_EXAM",
            weight: 0.6,
        },
    });

    console.log("✅ Seed concluído com sucesso!");
    console.log("\n📊 Dados criados:");
    console.log(`- ${await prisma.user.count()} usuários`);
    console.log(`- ${await prisma.workshop.count()} workshops`);
    console.log(`- ${await prisma.enrollment.count()} matrículas`);
    console.log(`- ${await prisma.class.count()} aulas`);
    console.log(`- ${await prisma.attendance.count()} presenças`);
    console.log(`- ${await prisma.grade.count()} notas`);

    console.log("\n🔑 Credenciais de acesso:");
    console.log("Admin: admin@example.com / admin123");
    console.log("Professor: joao@example.com / 123456");
    console.log("Coordenador: fernanda@example.com / 123456");
    console.log("Estudante: ana@example.com / 123456");
    console.log("Voluntário: beatriz@example.com / 123456");
}

main()
    .catch((e) => {
        console.error("❌ Erro durante o seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });