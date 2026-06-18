import { type FC, useEffect } from "react";
import { createPortal } from "react-dom";
import type { WithChildren } from "../../types/types";

type Props = WithChildren & {
  show: boolean;
  onClose: () => void;
};

/**
 * Centered modal overlay portaled to <body>, with background scroll locked
 * while open. Clicking the backdrop closes; clicks inside are ignored.
 */
const ModalWrapper: FC<Props> = ({ children, show, onClose }) => {
  useEffect(() => {
    if (!show) return;

    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [show]);

  if (!show) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export { ModalWrapper };
