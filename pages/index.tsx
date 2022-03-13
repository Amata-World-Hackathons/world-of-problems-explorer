import type { NextPage } from "next";
import Head from "next/head";
import Canvas from "../components/Canvas";

const Home: NextPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Head>
        <title>Explore a World of Problems</title>
        <meta name="description" content="Explore a world of problems" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-full w-full">
        <Canvas />
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
