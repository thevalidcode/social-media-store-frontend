import { cn } from "@/lib/utils";

export default function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("w-full mx-auto", className)}>{children}</div>;
}
