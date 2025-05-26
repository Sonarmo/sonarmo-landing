import '@/styles/globals.css'  // ou './styles/globals.css' selon ton chemin réel

import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Sonarmo</title>
        <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

