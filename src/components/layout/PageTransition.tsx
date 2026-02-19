import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [stage, setStage] = useState<"visible" | "out" | "in">("visible");
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      setStage("out");
      const t1 = setTimeout(() => {
        setDisplayChildren(children);
        setStage("in");
        const t2 = setTimeout(() => setStage("visible"), 200);
        return () => clearTimeout(t2);
      }, 150);
      return () => clearTimeout(t1);
    } else {
      setDisplayChildren(children);
    }
  }, [location.pathname, children]);

  const style: React.CSSProperties =
    stage === "out"
      ? { opacity: 0, transition: "opacity 150ms ease-out" }
      : stage === "in"
      ? { opacity: 1, transform: "translateY(0)", transition: "opacity 200ms ease-out, transform 200ms ease-out" }
      : {};

  const initialStyle: React.CSSProperties =
    stage === "in" ? { opacity: 0, transform: "translateY(8px)" } : {};

  return (
    <div
      style={{ ...initialStyle, ...style, willChange: stage !== "visible" ? "opacity, transform" : undefined }}
    >
      {displayChildren}
    </div>
  );
}
