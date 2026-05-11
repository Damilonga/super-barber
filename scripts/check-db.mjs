import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL nao configurada. Crie o arquivo .env.local primeiro.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const [result] = await sql`select now() as now, current_database() as database`;

console.log("Conexao com Neon OK");
console.log(`Database: ${result.database}`);
console.log(`Horario: ${result.now}`);
