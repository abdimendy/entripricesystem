import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = readFileSync(join(root, '.env'), 'utf8');
const match = env.match(/DATABASE_URL=(.+)/);
if (!match) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const connectionString = match[1].trim();
const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

const statements = [
  `ALTER TABLE "Businesses" ADD COLUMN IF NOT EXISTS "IsFeatured" boolean NOT NULL DEFAULT false`,
  `ALTER TABLE "Businesses" ADD COLUMN IF NOT EXISTS "IsApproved" boolean NOT NULL DEFAULT true`,
  `ALTER TABLE "Businesses" ADD COLUMN IF NOT EXISTS "ImageUrlsJson" text`,
  `ALTER TABLE "Businesses" ADD COLUMN IF NOT EXISTS "OpeningHoursJson" text`,
  `ALTER TABLE "Businesses" ADD COLUMN IF NOT EXISTS "Latitude" double precision`,
  `ALTER TABLE "Businesses" ADD COLUMN IF NOT EXISTS "Longitude" double precision`,
  `CREATE TABLE IF NOT EXISTS "ContactMessages" (
    "Id" serial PRIMARY KEY,
    "Name" character varying(100) NOT NULL,
    "Email" character varying(150) NOT NULL,
    "Phone" character varying(30),
    "Subject" character varying(150) NOT NULL,
    "Message" character varying(2000) NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT NOW(),
    "IsRead" boolean NOT NULL DEFAULT false
  )`,
  `CREATE TABLE IF NOT EXISTS "AnalyticsEvents" (
    "Id" serial PRIMARY KEY,
    "EventType" character varying(50) NOT NULL,
    "Path" character varying(300),
    "BusinessId" integer,
    "Meta" character varying(500),
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
  )`,
];

await client.connect();
for (const sql of statements) {
  await client.query(sql);
  console.log('OK:', sql.slice(0, 60) + '...');
}
await client.end();
console.log('Neon schema ready.');
