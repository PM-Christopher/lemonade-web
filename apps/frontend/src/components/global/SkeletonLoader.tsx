import React from "react";

function SkeletonLoader({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 ${className}`} />;
}

export default SkeletonLoader;
