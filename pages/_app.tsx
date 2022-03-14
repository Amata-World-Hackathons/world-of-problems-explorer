import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthContext";
import NavigationMenu from "../components/NavigationMenu";
import ProjectsSearchInput from "../components/ProjectsSearchInput";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <AuthProvider>
      <div className="h-screen w-screen overflow-hidden">
        <main className="h-full w-full relative">
          <NavigationMenu />

          <ProjectsSearchInput
            className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            onSelectProject={(projectId) => {
              if (projectId) {
                router.push({
                  pathname: "/projects/[projectId]",
                  query: { projectId },
                });
              } else {
                router.push("/");
              }
            }}
          />

          <Component {...pageProps} />
        </main>
      </div>
    </AuthProvider>
  );
}

export default MyApp;
