import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const file = process.argv[2];

if (!file) {
  console.error("Informe o arquivo SQL. Exemplo: npm run db:schema");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL nao configurada. Crie o arquivo .env.local primeiro.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const sqlPath = resolve(file);
const contents = await readFile(sqlPath, "utf8");

const statements = contents
  .split(";")
  .map((statement) => statement.trim())
  .filter((statement) => statement.length > 0 && !statement.startsWith("--"));

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`SQL executado com sucesso: ${file}`);
