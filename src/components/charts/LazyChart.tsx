import { memo, useEffect, useRef, useState, type FC } from "react";
import { PlayersGroupChart } from "./PlayersGroupChart";
import type { ChartGroup, ChartPricePoint } from "../../types/constants";

const LazyChart: FC<{
  chart: ChartGroup;
  stocks: ChartPricePoint[];
  stockColors: Record<string, string>;
}> = memo(({ chart, stocks, stockColors }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkVisibility = () => {
      const rect = el.getBoundingClientRect();
      const isInView =
        rect.bottom >= -300 && rect.top <= window.innerHeight + 300;
      setIsVisible(isInView);
    };

    checkVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.01,
      },
    );

    observer.observe(el);
    window.addEventListener("resize", checkVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <div ref={ref} className="mb-6 min-h-[520px]">
      {isVisible ? (
        <PlayersGroupChart
          title={chart.title}
          stocks={stocks}
          players={chart.players}
          playerColors={stockColors}
        />
      ) : (
        <div className="h-[520px] rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800" />
      )}
    </div>
  );
});

export { LazyChart };
