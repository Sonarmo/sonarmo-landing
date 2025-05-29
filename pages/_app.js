// pages/_app.js
import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/builder/DashboardLayout";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  const getLayout = isDashboard
    ? (page) => <DashboardLayout>{page}</DashboardLayout>
    : (page) => page;

  return getLayout(
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