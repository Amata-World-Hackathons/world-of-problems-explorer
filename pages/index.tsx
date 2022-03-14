import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import AbstractSpaceOverlay from "../components/AbstractSpaceOverlay";
import MapboxMap from "../components/MapboxMap";
import ProjectOverlay from "../components/ProjectOverlay";
import ProjectsSearchInput from "../components/ProjectsSearchInput";

const Home: NextPage = () => {
  const router = useRouter();

  const anchorId = router.query.anchorId
    ? parseInt(router.query.anchorId as string, 10)
    : undefined;
  const projectId = (router.query.projectId || "") as string;

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Head>
        <title>Explore a World of Problems</title>
        <meta name="description" content="Explore a world of problems" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full w-full relative">
        <MapboxMap
          onClickAnchor={(anchor) =>
            router.push({
              pathname: "/projects/[projectId]/anchors/[anchorId]",
              query: { projectId: anchor.projectId, anchorId: anchor.id },
            })
          }
          className="w-full h-full m-0 "
        >
          <AbstractSpaceOverlay />
        </MapboxMap>

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

        <ProjectOverlay
          anchorId={anchorId}
          projectId={projectId}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-screen z-20"
          onClose={() => router.push("/")}
        />
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
