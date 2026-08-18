import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasUpstashUrl: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    hasUpstashToken: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
