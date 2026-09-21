"use client";

import Link from "next/link";
import { Button } from "@lemonade/ui";
import MainLayout from "@/components/layouts/MainLayout";

export default function MainNotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">This page could not be found</h1>
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </MainLayout>
  );
}
