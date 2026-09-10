import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "primary-inverse" | "secondary" | "secondary-inverse" | "ghost";

interface SharedProps {
  variant?: Variant;
  withArrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

interface ButtonAsButton extends SharedProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> {
  to?: undefined;
}

interface ButtonAsLink extends SharedProps {
  to: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants: Record<Variant, string> = {
  // Forest-green pill button on light/cream sections
  primary: "bg-ink text-paper hover:bg-ink-soft",
  // White pill on dark sections
  "primary-inverse": "bg-paper text-ink hover:bg-mist",
  secondary: "border border-ink/25 text-ink hover:border-ink/60 bg-transparent",
  "secondary-inverse": "border border-white/30 text-paper hover:border-white/60 bg-transparent",
  ghost: "text-current hover:opacity-70 bg-transparent",
};

const baseClasses =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium tracking-tight transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0";

function Content({ withArrow, icon, children }: Pick<SharedProps, "withArrow" | "icon" | "children">) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </>
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", withArrow, icon, className, children } = props;
  const classes = cn(baseClasses, variants[variant], className);

  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        <Content withArrow={withArrow} icon={icon}>
          {children}
        </Content>
      </Link>
    );
  }

  const { to: _to, variant: _v, withArrow: _w, icon: _i, className: _c, children: _ch, ...rest } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...rest}>
      <Content withArrow={withArrow} icon={icon}>
        {children}
      </Content>
    </button>
  );
}
