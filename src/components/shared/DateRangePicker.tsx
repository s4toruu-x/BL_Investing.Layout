import { useRef, type FC } from "react";
import { FaChevronDown } from "react-icons/fa";

export type DateRangeValue = {
  startDate: string;
  endDate: string;
};

type Props = {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
};

const DateRangePicker: FC<Props> = ({ value, onChange, className }) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: "startDate" | "endDate", val: string) => {
    onChange({ ...value, [field]: val });
  };

  const openPicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (!ref.current) return;
    if (typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
    } else {
      ref.current.focus();
    }
  };

  const formControl =
    "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition";

  return (
    <div
      className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end ${className ?? ""}`}
    >
      {/* From */}
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          From
        </p>
        <button
          type="button"
          onClick={() =>
            openPicker(startRef as React.RefObject<HTMLInputElement>)
          }
          className={`${formControl} flex items-center justify-between gap-3 cursor-pointer`}
        >
          <span
            className={`truncate ${!value.startDate ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {value.startDate || "Start date"}
          </span>
          <FaChevronDown className="pointer-events-none h-3 w-3 text-gray-400 shrink-0 ml-2" />
        </button>
      </div>

      {/* To */}
      <div>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          To
        </p>
        <button
          type="button"
          onClick={() =>
            openPicker(endRef as React.RefObject<HTMLInputElement>)
          }
          className={`${formControl} flex items-center justify-between gap-3 cursor-pointer`}
        >
          <span
            className={`truncate ${!value.endDate ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {value.endDate || "End date"}
          </span>
          <FaChevronDown className="pointer-events-none h-3 w-3 text-gray-400 shrink-0 ml-2" />
        </button>
      </div>

      <input
        ref={startRef}
        type="date"
        value={value.startDate}
        onChange={(e) => handleChange("startDate", e.target.value)}
        className="sr-only"
      />
      <input
        ref={endRef}
        type="date"
        value={value.endDate}
        onChange={(e) => handleChange("endDate", e.target.value)}
        className="sr-only"
      />
    </div>
  );
};

export { DateRangePicker };
