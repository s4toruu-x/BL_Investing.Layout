import type { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/shared/Layout";
import { HomePage } from "./components/home/HomePage";
import { StockList } from "./components/stocks/StockList";
import { StockInformation } from "./components/stocks/StockInformation";
import { ChartsWrapper } from "./components/charts/ChartsWrapper";
import { BetsPage } from "./components/bets/BetsPage";

const AppRouting: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/stocks" element={<StockList />} />
        <Route path="/stocks/:stockId" element={<StockInformation />} />
        <Route path="/charts" element={<ChartsWrapper />} />
        <Route path="/bets" element={<BetsPage />} />
        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export { AppRouting };
