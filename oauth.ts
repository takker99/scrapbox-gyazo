import type { Result } from "./types.ts";
import type { GyazoErrorResponse } from "./errors.ts";
import { getGyazoError } from "./errors.ts";

/** scrapbox.io上で、scrapboxで登録したGyazo OAuth tokenを取得する */
export async function getOAuthTokenInScrapbox(): Promise<
  Result<{ token: string }, GyazoErrorResponse>
> {
  if (location.hostname !== "scrapbox.io") {
    throw Error(
      "Gyazo OAuth Token for Scrapbox can't be got at any domains without scrapbox.io",
    );
  }
  const res = await fetch(
    "https://scrapbox.io/api/login/gyazo/oauth-upload/token",
  );
  if (!res.ok) {
    const error = getGyazoError(res.status, await res.text());
    return { ok: false, ...error };
  }
  const token = (await res.json()).token;
  return { ok: true, token };
}
