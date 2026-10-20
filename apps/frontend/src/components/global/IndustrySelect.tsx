"use client";
import React from "react";
import { useIndustriesQuery } from "@/features/shared";
import { SearchableSelect } from "@/components/global/SearchableSelect";

interface IndustrySelectProps {
  id?: string;
  value: string;
  onChange: (industry: string) => void;
  onBlur?: () => void;
  className?: string;
}

// Searchable industry picker backed by the backend's industry list.
export function IndustrySelect(props: IndustrySelectProps) {
  const { data, isLoading } = useIndustriesQuery();
  const options = (data?.industries ?? []).map((item) => ({ value: item.name, label: item.name }));

  return (
    <SearchableSelect
      {...props}
      options={options}
      loading={isLoading}
      ariaLabel="Industry"
      placeholder="Select industry"
      searchPlaceholder="Search industry"
      emptyText="No industry found"
    />
  );
}
