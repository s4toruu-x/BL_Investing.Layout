import type { FC, ReactNode } from "react";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";

const maxWidthClass: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-none",
};

const PageWrapper: FC<{ children: ReactNode; maxWidth?: MaxWidth }> = ({
  children,
  maxWidth = "full",
}) => (
  <div className={`${maxWidthClass[maxWidth]} flex flex-col gap-4`}>
    {children}
  </div>
);

export { PageWrapper };
