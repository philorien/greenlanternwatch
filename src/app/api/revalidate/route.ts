import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SITE_CACHE_TAG } from "@/sanity/client";

/**
 * Sanity publish webhook. Expires the site-wide cache tag so the next visit to
 * each page re-renders it with fresh content. Set up in sanity.io/manage
 * with projection `{_type}` and the same secret as SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return new Response("Missing SANITY_REVALIDATE_SECRET", { status: 500 });
  }

  // Waits for the Content Lake to settle so re-renders fetch the new content.
  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Expire immediately, not "max". With "max" the Sanity fetch cache is also
  // stale-while-revalidate, so the page that regenerates first reads the old
  // data and gets cached as fresh: new articles never appeared on listings.
  revalidateTag(SITE_CACHE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
