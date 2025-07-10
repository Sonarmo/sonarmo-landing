import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "/components/builder/LanguageSwitcher";
import Footer from "/components/layout/Footer";
import Header from "/components/layout/Header";

export default function Contact() {
    const [formSubmitted, setFormSubmitted] = useState(false);
    

    return (
        <>
        <Header />
            <Head>
                <title>Sonarmo - Contact</title>
                <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
            </Head>
            <main className="bg-black text-white min-h-screen relative overflow-x-hidden">
                

                {/* CONTACT FORM ONLY */}
                <section className="relative px-4 py-8 flex justify-center min-h-screen">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute w-[300px] h-[300px] bg-[#F28500] rounded-full blur-[120px] top-1/4 left-1/2 opacity-60" />
                        <div className="absolute w-[300px] h-[300px] bg-[#FF00FF] rounded-full blur-[100px] top-1/2 right-1/2 opacity-50" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                        <div className="relative w-[350px] h-[194px] mb-0">
                            <Image
                                src="/Logo-app-header.png"
                                alt="Sonarmo Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <form
                            action="https://formspree.io/f/mrbpndbq"
                            method="POST"
                            onSubmit={() => setFormSubmitted(true)}
                            className="flex flex-col gap-4 w-full text-left"
                        >
                            <input type="hidden" name="_captcha" value="false" />
                            <label className="text-sm">Nom
                                <input type="text" name="Nom" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Prénom
                                <input type="text" name="Prénom" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Email
                                <input type="email" name="email" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1" /></label>
                            <label className="text-sm">Message
                                <textarea name="message" rows="4" required className="w-full px-4 py-2 rounded bg-white/90 text-black mt-1"></textarea></label>
                            <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] px-6 py-2 rounded text-white font-semibold">Envoyer</button>
                            {formSubmitted && (
                                <p className="text-green-400 mt-4">Merci de nous avoir contacté, nous reviendrons vers vous le plus rapidement possible.</p>
                            )}
                        </form>
                    </div>
                </section>

                
            </main>
            <Footer />
        </>
    );
}
