import { clientEnv } from "@/lib/env.client";

export const mainUrl = clientEnv.NEXT_PUBLIC_BASE_URL;

export const baseUrl = `${mainUrl}/v1`;
