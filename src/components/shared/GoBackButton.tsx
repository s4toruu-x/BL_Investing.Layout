import type { FC } from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton: FC = () => {
  const nav = useNavigate();

  return (
    <button
      onClick={() => nav(-1)}
      className="mb-4 text-sm text-blue-600 hover:underline cursor-pointer"
    >
      ← Go Back
    </button>
  );
};

export { GoBackButton };
