import { useEffect, useState } from "react";

interface Props {
  delay: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export function StaggerReveal({ delay, duration = 400, children, className = "" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
