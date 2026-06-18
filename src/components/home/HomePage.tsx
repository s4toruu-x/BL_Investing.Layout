import { type FC } from "react";
import { Link } from "react-router-dom";
import { PageWrapper } from "../shared/PageWrapper";
import { PageHeader } from "../shared/PageHeader";

const HomePage: FC = () => {
  return (
    <PageWrapper>
      <PageHeader
        title="Welcome to Blue Lock Investing"
        subtitle="Trade your favorite characters, bet on the action, and grow your portfolio."
      />

      <div className="flex flex-col items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800/50 dark:bg-blue-900/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            Start with daily virtual cash.
          </p>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Create a free account to trade, bet, and climb the rankings.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Link
            to="/"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Sign up
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/50"
          >
            Log in
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export { HomePage };
