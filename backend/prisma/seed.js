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
        },
    });

    // Criar professores
    const teacher1 = await prisma.user.create({
        data: {
            name: "Prof. João Silva",
            email: "joao@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "TEACHER",
        },
    });

    const teacher2 = await prisma.user.create({
        data: {
            name: "Prof. Maria Santos",
            email: "maria@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "TEACHER",
        },
    });

    // Criar estudantes
    const student1 = await prisma.user.create({
        data: {
            name: "Ana Costa",
            email: "ana@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "STUDENT",
        },
    });

    const student2 = await prisma.user.create({
        data: {
            name: "Carlos Oliveira",
            email: "carlos@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "STUDENT",
        },
    });

    // Criar voluntários
    const volunteer1 = await prisma.user.create({
        data: {
            name: "Beatriz Lima",
            email: "beatriz@example.com",
            password: await bcrypt.hash("123456", 10),
            role: "VOLUNTEER",
        },
    });

    // Criar workshops
    const workshop1 = await prisma.workshop.create({
        data: {
            title: "Desenvolvimento Web Básico",
            description: "Aprenda os fundamentos de HTML, CSS e JavaScript",
            startDate: new Date("2024-02-01"),
            endDate: new Date("2024-04-30"),
            maxParticipants: 20,
        },
    });

    const workshop2 = await prisma.workshop.create({
        data: {
            title: "Python para Iniciantes",
            description: "Introdução à programação com Python",
            startDate: new Date("2024-03-01"),
            endDate: new Date("2024-05-31"),
            maxParticipants: 15,
        },
    });

    // Criar matrículas
    await prisma.enrollment.create({
        data: {
            userId: student1.id,
            workshopId: workshop1.id,
            status: "ACTIVE",
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: student1.id,
            workshopId: workshop2.id,
            status: "ACTIVE",
        },
    });

    await prisma.enrollment.create({
        data: {
            userId: student2.id,
            workshopId: workshop1.id,
            status: "ACTIVE",
        },
    });

    // Criar aulas
    const class1 = await prisma.class.create({
        data: {
            workshopId: workshop1.id,
            date: new Date("2024-02-05"),
            subject: "Introdução ao HTML",
            taughtById: teacher1.id,
            enrolledStudents: 2,
        },
    });

    const class2 = await prisma.class.create({
        data: {
            workshopId: workshop1.id,
            date: new Date("2024-02-12"),
            subject: "CSS Básico",
            taughtById: teacher1.id,
            enrolledStudents: 2,
        },
    });

    const class3 = await prisma.class.create({
        data: {
            workshopId: workshop2.id,
            date: new Date("2024-03-05"),
            subject: "Variáveis e Tipos de Dados",
            taughtById: teacher2.id,
            enrolledStudents: 1,
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
        },
    });

    await prisma.grade.create({
        data: {
            userId: student2.id,
            classId: class1.id,
            grade: 9.0,
            notes: "Excelente participação",
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
    console.log("Estudante: ana@example.com / 123456");
}

main()
    .catch((e) => {
        console.error("❌ Erro durante o seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
