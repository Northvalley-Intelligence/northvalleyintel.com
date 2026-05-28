import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-north-teal",
  {
    variants: {
      variant: {
        primary:
          "bg-north-ink text-white shadow-[0_14px_30px_rgba(15,23,32,0.18)] hover:bg-black",
        secondary:
          "border border-north-line bg-white/72 text-north-ink hover:bg-white",
        light:
          "border border-white/16 bg-white/10 text-white hover:bg-white/16",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
};

export function ButtonLink({
  href,
  children,
  className,
  variant,
  showIcon = true,
}: ButtonLinkProps) {
  const isExternal = href.startsWith("mailto:") || href.startsWith("http");
  const content = (
    <>
      {children}
      {showIcon ? (
        <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
      ) : null}
    </>
  );

  if (isExternal) {
    return (
      <a className={cn(buttonVariants({ variant }), className)} href={href}>
        {content}
      </a>
    );
  }

  return (
    <Link className={cn(buttonVariants({ variant }), className)} href={href}>
      {content}
    </Link>
  );
}
