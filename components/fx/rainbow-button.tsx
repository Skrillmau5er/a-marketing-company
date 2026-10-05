import { cn } from "@/lib/utils";

export function RainbowButton({ children, className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "conic-border group relative inline-flex rounded-full p-[2px] font-semibold text-white shadow-[0_0_50px_-10px_#ff2bd6] transition-transform duration-200 active:scale-95",
        className,
      )}
    >
      <span className="shimmer relative inline-flex items-center gap-2 rounded-full bg-[#0b0217] px-8 py-4 transition-colors duration-300 group-hover:bg-[#0b0217]/40">
        {children}
      </span>
    </button>
  );
}
