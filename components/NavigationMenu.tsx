import classnames from "classnames";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

const NavigationMenu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  return (
    <nav {...rest} className={classnames("text-slate-300")}>
      <div
        className={classnames(
          "absolute top-0 right-0 transition bg-slate-800 py-1 px-3 z-20 shadow-md shadow-cyan-600 rounded-bl-lg",
          {
            "opacity-0 translate-x-full": loading,
          }
        )}
      >
        {user ? (
          <span className="text-xs uppercase">{user.email}</span>
        ) : (
          <button
            className="font-mono lowercase hover:underline underline-offset-2"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};

export default NavigationMenu;
