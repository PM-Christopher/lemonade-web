"use client";

import Link from "next/link";
import { Button } from "@lemonade/ui";

export default function AuthNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">This page could not be found</h1>
      <Button asChild>
        <Link href="/login">Back to login</Link>
      </Button>
    </div>
  );
}
