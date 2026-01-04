import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

export default function AssetPreview({
  title,
  url,
  hint,
  size,
}: {
  title: string;
  url?: string;
  hint?: string;
  size: "logo" | "favicon" | "image";
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-gradient-to-br from-muted/60 via-background to-muted/30 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <ImageIcon className="h-3.5 w-3.5" />
        </span>
        {title}
      </div>
      <div className="mt-3 flex items-center justify-center rounded-lg border border-dashed border-border/70 bg-card p-4">
        {url ? (
          <img
            src={url}
            alt={`${title} preview`}
            className={cn(
              "object-contain",
              size === "favicon"
                ? "h-12 w-12"
                : size === "logo"
                ? "max-h-16 w-full"
                : "max-h-32 w-full"
            )}
          />
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Upload to preview
          </div>
        )}
      </div>
      {hint && (
        <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}
