import { useEffect, useState, useRef } from "react";

interface Props {
  stepKey: number;
  children: React.ReactNode;
}

export function StepTransition({ stepKey, children }: Props) {
  const [display, setDisplay] = useState(children);
  const [stage, setStage] = useState<"visible" | "out" | "in">("visible");
  const prevKey = useRef(stepKey);

  useEffect(() => {
    if (stepKey !== prevKey.current) {
      const goingForward = stepKey > prevKey.current;
      prevKey.current = stepKey;
      setStage("out");
      const t = setTimeout(() => {
        setDisplay(children);
        setStage("in");
        setTimeout(() => setStage("visible"), 250);
      }, 200);
      return () => clearTimeout(t);
    } else {
      setDisplay(children);
    }
  }, [stepKey, children]);

  const style: React.CSSProperties =
    stage === "out"
      ? { opacity: 0, transform: "translateX(-20px)", transition: "opacity 200ms ease-out, transform 200ms ease-out" }
      : stage === "in"
      ? { opacity: 1, transform: "translateX(0)", transition: "opacity 250ms ease-out, transform 250ms ease-out" }
      : {};

  const initial: React.CSSProperties =
    stage === "in" ? { opacity: 0, transform: "translateX(20px)" } : {};

  return <div style={{ ...initial, ...style }}>{display}</div>;
}
