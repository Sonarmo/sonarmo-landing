import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="fr">
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="font-[Poppins] bg-[#121212] text-white">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
