import { useEffect, useState } from "react";

export function useDockButton() {
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return undefined;

    const atualizarPosicao = () => {
      const { top, bottom } = footer.getBoundingClientRect();
      setDocked(top < window.innerHeight && bottom > 0);
    };

    atualizarPosicao();

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        setDocked(entry.isIntersecting);
      });

      observer.observe(footer);
      return () => observer.disconnect();
    }

    window.addEventListener("scroll", atualizarPosicao, { passive: true });
    window.addEventListener("resize", atualizarPosicao);

    return () => {
      window.removeEventListener("scroll", atualizarPosicao);
      window.removeEventListener("resize", atualizarPosicao);
    };
  }, []);

  return docked;
}
