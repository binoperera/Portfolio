import fs from "fs";
import path from "path";
import { PortfolioData } from "./types";
import { defaultData } from "./defaultData";

const KV_KEY = "portfolio:data";
const LOCAL_DB_PATH = path.join(process.cwd(), "data", "local-db.json");

// Set automatically when you connect a Redis integration (e.g. Upstash) to
// your Vercel project under the Storage tab.
const hasKv = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// ---- Local JSON-file fallback (used only when Vercel KV env vars are not set,
// e.g. while developing on your own machine with `npm run dev`) --------------
function readLocal(): PortfolioData {
  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function writeLocal(data: PortfolioData) {
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// ---- Redis / Upstash (used in production on Vercel) --------------------------
async function readKv(): Promise<PortfolioData> {
  const { Redis } = await import("@upstash/redis");
  const redis = Redis.fromEnv();
  const data = await redis.get<PortfolioData>(KV_KEY);
  if (!data) {
    await redis.set(KV_KEY, defaultData);
    return defaultData;
  }
  return data;
}

async function writeKv(data: PortfolioData) {
  const { Redis } = await import("@upstash/redis");
  const redis = Redis.fromEnv();
  await redis.set(KV_KEY, data);
}

// ---- Public API --------------------------------------------------------------
export async function getData(): Promise<PortfolioData> {
  return hasKv ? readKv() : Promise.resolve(readLocal());
}

export async function saveData(data: PortfolioData): Promise<void> {
  if (hasKv) {
    await writeKv(data);
  } else {
    writeLocal(data);
  }
}

export async function updateData(
  mutator: (data: PortfolioData) => PortfolioData
): Promise<PortfolioData> {
  const current = await getData();
  const next = mutator(current);
  await saveData(next);
  return next;
}
