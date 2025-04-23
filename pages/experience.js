import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Experience() {
    return (
        <>
            <Head>
                <title>L’expérience Sonarmo</title>
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <main className="bg-[#121212] text-white font-[Poppins] min-h-screen px-6">
                {/* HERO */}
                <section className="text-center py-20">
                    <h1 className="text-5xl font-semibold mb-6">L’expérience Sonarmo</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Créez une ambiance musicale unique, adaptée à votre espace et à votre identité.
                    </p>
                </section>

                {/* SECTION - PERSONNALISATION */}
                <section className="py-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Personnalisation en temps réel</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Ajustez l’énergie musicale, le volume et l’ambiance selon l’instant. L’interface mobile vous permet de créer ou régénérer une playlist à tout moment.
                    </p>
                    <div className="flex justify-center">
                        <Image src="/iphone.png" alt="Contrôle mobile" width={300} height={600} />
                    </div>
                </section>

                {/* SECTION - SUIVI */}
                <section className="py-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Suivi et optimisation</h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-8">
                        Analysez l’impact de votre ambiance sonore avec des données claires. Repérez les moments où la musique attire le plus l’attention et booste l’expérience client.
                    </p>
                    <div className="flex justify-center">
                        <Image src="/Mockup mac.png" alt="Dashboard Sonarmo" width={800} height={500} />
                    </div>
                </section>

                {/* SECTION - CATALOGUE */}
                <section className="py-16 text-center">
                    <h2 className="text-3xl font-semibold mb-4">Un catalogue infini</h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Grâce à Spotify, accédez à plus de 100 millions de titres pour créer une ambiance qui vous ressemble parfaitement.
                    </p>
                </section>

                {/* CTA */}
                <section className="py-20 text-center">
                    <Link href="/contact">
                        <button className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-8 py-4 rounded-full text-white font-semibold shadow-md">
                            Découvrir Sonarmo
                        </button>
                    </Link>
                </section>
            </main>
        </>
    );
}
