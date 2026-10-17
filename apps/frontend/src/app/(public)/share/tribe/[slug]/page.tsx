// Guest view of a tribe. Middleware rewrites /tribe/{slug} here when nobody is signed in.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "@lemonade/api-client";
import { GuestTribePreview } from "@/components/tribe/GuestTribePreview";
import { tribesServerApi } from "@/features/tribes/api.server";

type PageProps = { params: Promise<{ slug: string }> };

async function loadTribe(slug: string) {
  try {
    return (await tribesServerApi.getPublicTribe(slug)).tribe;
  } catch (error) {
    if (error instanceof ApiError && error.kind === "notFound") return null;
    throw error;
  }
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const tribe = await loadTribe((await props.params).slug);
  if (!tribe) return { title: "Tribe" };

  return {
    title: tribe.tribe_name,
    description: tribe.description.slice(0, 160),
    openGraph: {
      title: tribe.tribe_name,
      description: tribe.description.slice(0, 160),
      ...(tribe.image ? { images: [tribe.image] } : {}),
    },
  };
}

export default async function GuestTribePage(props: PageProps) {
  const tribe = await loadTribe((await props.params).slug);
  if (!tribe) notFound();

  return <GuestTribePreview tribe={tribe} />;
}
