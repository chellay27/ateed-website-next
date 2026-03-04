interface SectionHeadingProps {
  eyebrow?: string;
  children: React.ReactNode;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  children,
  description,
  align = "left",
  dark = false,
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-3xl mb-12 lg:mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <span
          className={`inline-block text-xs font-medium tracking-[0.2em] uppercase mb-4 ${
            dark ? "text-text-tertiary" : "text-accent"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif heading-lg font-normal ${
          dark ? "text-white" : "text-text-primary"
        }`}
      >
        {children}
      </h2>
      {description && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            dark ? "text-text-tertiary" : "text-text-secondary"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
