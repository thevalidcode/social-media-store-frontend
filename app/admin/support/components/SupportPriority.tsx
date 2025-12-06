"use client";

export default function SupportPriority({ priority }: { priority: string }) {
  const colors = {
    high: "text-destructive",
    medium: "text-yellow-600",
    low: "text-green-600",
  } as const;

  return (
    <span
      className={`font-medium capitalize ${
        colors[priority as keyof typeof colors]
      }`}
    >
      {priority}
    </span>
  );
}
