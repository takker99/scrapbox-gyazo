import type { Result } from "./types.ts";
import type { GyazoErrorResponse } from "./errors.ts";
import { getGyazoError } from "./errors.ts";

/** uploadに使うmetadataとtoken */
export interface UploadInit {
  /** Gyazoの"From xxx"欄に表示される文字列 */ title?: string;
  /** Gyazoのhash tags書き込み欄に書き込まれる文字列 */ description?: string;
  /** 画像の作成日時 */ created?: number;
  /** Gyazoのaccess token */ token: string;
  /** metadataを公開するかどうか 既定で非公開 */ metadataIsPublic?: boolean;
  /** 追加先Gyazo collectionのID */ collectionId?: string;
  /** 画像に関連付けられたURL */ refererURL?: string | URL;
}
/** Gyazoへのupload結果 */
export interface UploadResult {
  /** Gyazoにuploadした画像のID */ image_id: string;
  /** 画像の詳細画面へのURL */ permalink_url: string;
  /** 画像のthumbnail URL */ thumb_url: string;
  /** 画像のoriginal URL */ url: string;
  /** 画像の拡張子 */ type: string;
}

/** Gyazoへ画像をuploadする
 *
 * @param image uploadする画像データ
 * @param init tokenとmetadata
 */
export async function upload(
  image: Blob,
  init: UploadInit,
): Promise<Result<UploadResult, GyazoErrorResponse>> {
  const {
    token,
    title,
    description,
    metadataIsPublic,
    collectionId,
    refererURL,
    created = Math.round(new Date().getTime() / 1000),
  } = init;
  const formData = new FormData();
  formData.append("imagedata", image);
  formData.append("access_token", token);
  if (refererURL) formData.append("referer_url", refererURL.toString());
  if (title) formData.append("title", title);
  if (description) formData.append("desc", description);
  if (collectionId) formData.append("collection_id", collectionId);
  if (metadataIsPublic) formData.append("metadata_is_public", "true");
  formData.append("created_at", `${created}`);

  const res = await fetch(
    "https://upload.gyazo.com/api/upload",
    {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      body: formData,
    },
  );
  if (!res.ok) {
    const error = getGyazoError(res.status, await res.json());
    return { ok: false, ...error };
  }

  return { ok: true, ...(await res.json()) };
}
