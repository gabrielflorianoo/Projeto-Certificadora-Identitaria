// Setup script para inicializar o projeto
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Iniciando setup do projeto...");

// Verificar se o arquivo .env existe
const envPath = path.join(process.cwd(), ".env");
const envExamplePath = path.join(process.cwd(), ".env.example");

if (!fs.existsSync(envPath)) {
    console.log("📝 Criando arquivo .env...");
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log("✅ Arquivo .env criado a partir do .env.example");
        console.log(
            "⚠️  Por favor, configure as variáveis de ambiente no arquivo .env",
        );
    } else {
        console.log("❌ Arquivo .env.example não encontrado");
    }
} else {
    console.log("✅ Arquivo .env já existe");
}

try {
    console.log("🔄 Gerando Prisma Client...");
    execSync("npx prisma generate", { stdio: "inherit" });
    console.log("✅ Prisma Client gerado com sucesso");

    console.log("🔄 Verificando status das migrações...");
    execSync("npx prisma migrate status", { stdio: "inherit" });

    console.log("✅ Setup concluído!");
    console.log("\n📋 Próximos passos:");
    console.log("1. Configure as variáveis de ambiente no arquivo .env");
    console.log('2. Execute "npm run migrate" para aplicar as migrações');
    console.log('3. Execute "npm start" para iniciar o servidor');
} catch (error) {
    console.error("❌ Erro durante o setup:", error.message);
    console.log("\n⚠️  Certifique-se de que:");
    console.log("- O banco de dados está rodando");
    console.log("- As variáveis de ambiente estão configuradas corretamente");
}
