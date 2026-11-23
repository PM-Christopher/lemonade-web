import { Suspense } from "react";
import FeedClient from "./FeedClient";

// The tribe filter comes from the URL, so the client part sits in Suspense.
export default function FeedPage() {
  return (
    <Suspense>
      <FeedClient />
    </Suspense>
  );
}
