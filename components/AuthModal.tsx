import classnames from "classnames";
import { useEffect, useRef } from "react";

export interface AuthModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        onCloseRef.current();
        return false;
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  return (
    <div
      className={classnames(
        "fixed top-0 bottom-0 left-0 right-0 transition-opacity duration-300 bg-slate-800 z-20 flex flex-col justify-center items-center",
        {
          "opacity-0 pointer-events-none": !isOpen,
          "opacity-90 pointer-events-auto": isOpen,
        }
      )}
      onClick={() => onClose()}
    >
      <div className="w-xl">
        <h1>TODO: Login</h1>
      </div>
    </div>
  );
};

export default AuthModal;
