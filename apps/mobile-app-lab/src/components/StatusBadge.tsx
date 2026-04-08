import React from "react";

type StatusBadgeProps = {
  label?: string;
};

export function StatusBadge({ label = "Status" }: StatusBadgeProps) {
  return <span>{label}</span>;
}

