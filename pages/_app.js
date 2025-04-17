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
