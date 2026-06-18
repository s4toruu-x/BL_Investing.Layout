import { useMemo, type FC } from "react";
import { PageWrapper } from "../shared/PageWrapper";
import { PageHeader } from "../shared/PageHeader";
import { PlayersGroupChart } from "./PlayersGroupChart";
import { LazyChart } from "./LazyChart";
import { buildStockColors } from "./colors";
import { chartGroups, priceHistory } from "../../types/constants";

const ChartsWrapper: FC = () => {
  const stocks = priceHistory;

  const stockColors = useMemo(
    () => buildStockColors(stocks.map((s) => s.stock_id)),
    [stocks],
  );

  return (
    <PageWrapper>
      <PageHeader title="Charts" subtitle="Price history grouped by sector." />

      {chartGroups.map((chart, index) =>
        index === 0 ? (
          // First chart mounts eagerly; the rest lazy-load as they scroll in.
          <div key={chart.id} className="mb-6">
            <PlayersGroupChart
              title={chart.title}
              stocks={stocks}
              players={chart.players}
              playerColors={stockColors}
            />
          </div>
        ) : (
          <LazyChart
            key={chart.id}
            chart={chart}
            stocks={stocks}
            stockColors={stockColors}
          />
        ),
      )}
    </PageWrapper>
  );
};

export { ChartsWrapper };
