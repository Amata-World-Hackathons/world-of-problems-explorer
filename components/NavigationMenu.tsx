import classnames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";

const NavigationMenu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <nav {...rest} className={classnames("text-slate-300")}>
      <div
        className={classnames(
          "absolute top-0 right-0 transition bg-slate-800 py-1 px-3 z-20 shadow-md shadow-cyan-600 border-cyan-600 border-2",
          {
            "opacity-0 translate-x-full": loading,
          }
        )}
      >
        {user ? (
          <>
            <span className="text-xs uppercase">{user.email}</span>

            <button className="ml-4 text-xs uppercase" onClick={logout}>
              Signout
            </button>
          </>
        ) : (
          <button
            className="font-mono lowercase hover:underline underline-offset-2"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Login
          </button>
        )}
      </div>

      <ul className="bg-slate-800 absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-r-lg py-2 border-r border-y border-cyan-600">
        <li>
          <Link
            href={{
              pathname: "/",
              query: {
                lat: 0.01,
                lng: 0.01,
                zoom: 3,
              },
            }}
          >
            <a className="p-2">
              <span className="material-icons text-3xl">public</span>
            </a>
          </Link>
        </li>
      </ul>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};

export default NavigationMenu;
