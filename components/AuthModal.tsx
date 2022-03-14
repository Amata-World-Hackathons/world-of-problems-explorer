import classnames from "classnames";
import firebaseui from "firebaseui";
import { useEffect, useRef } from "react";
import { legacyApp, legacyFirebase } from "../contexts/globals/firebaseApp";

export interface AuthModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const onCloseRef = useRef(onClose);
  const uiLocationRef = useRef(null);
  const uiRef = useRef<firebaseui.auth.AuthUI>(null);

  useEffect(() => {
    const firebaseui = require("firebaseui");

    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        ev.stopPropagation();
        onCloseRef.current();
        return false;
      }
    };
    window.addEventListener("keydown", listener);

    if (!uiRef.current) {
      (uiRef as any).current = new firebaseui.auth.AuthUI(
        legacyFirebase.auth(legacyApp)
      );
    }

    if (uiLocationRef.current) {
      uiRef.current!.start(uiLocationRef.current, {
        signInSuccessUrl: process.env.NEXT_PUBLIC_BASE_PATH || "/",
        signInOptions: [
          legacyFirebase.auth.GoogleAuthProvider.PROVIDER_ID,
          legacyFirebase.auth.EmailAuthProvider.PROVIDER_ID,
          //   firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
        ],
        tosUrl: "",
        privacyPolicyUrl: "",
      });
    }
    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  return (
    <div
      className={classnames(
        "fixed top-0 bottom-0 left-0 right-0 transition-opacity duration-300 bg-slate-800 z-50 flex flex-col justify-center items-center",
        {
          "opacity-0 pointer-events-none": !isOpen,
          "opacity-90 pointer-events-auto": isOpen,
        }
      )}
      onClick={() => onClose()}
    >
      <div
        className="w-xl relative shadow-md shadow-cyan-600 p-8 border-2 border-cyan-600"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Login to contribute to the map</h2>

        <div ref={uiLocationRef} className="m-4"></div>
        <span>
          Powered by{" "}
          <a
            href="https://firebase.google.com/"
            target="_blank"
            rel="noreferrer nofollow"
          >
            Firebase
          </a>
        </span>
      </div>
    </div>
  );
};

export default AuthModal;
