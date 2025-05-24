import '@/styles/globals.css'  // ou './styles/globals.css' selon ton chemin réel

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sonarmo</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

