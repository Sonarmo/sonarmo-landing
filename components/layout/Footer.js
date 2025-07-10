"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-sm text-gray-400 px-6 py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-y-8 w-full">

        {/* Bloc gauche + logo FT + label */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6 items-center text-center sm:text-left">

          {/* Réseaux + Liens */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-center sm:justify-start gap-4">
              <a href="https://www.instagram.com/sonarmo_ia/?hl=fr" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/instagram.png" alt="Instagram" width={24} height={24} />
              </a>
              <a href="https://www.linkedin.com/company/sonarmo/" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61574580608705" target="_blank" rel="noopener noreferrer">
                <Image src="/icons/facebook.png" alt="Facebook" width={24} height={24} />
              </a>
            </div>
            <Link href="/sonarmo-team" className="hover:text-white">Sonarmo Team</Link>
            <Link href="/about" className="hover:text-white">À propos de nous</Link>
            <Link href="/contact" className="hover:text-white">Nous contacter</Link>
            <Link href="/label" className="hover:text-white">Découvrez notre label</Link>
          </div>

          {/* Logo French Tech + Label Atmosphère */}
          <div className="mt-5 sm:mt-0 sm:ml-3 flex flex-col items-center sm:items-start gap-3">
            <div className="flex gap-4 items-center">
              {/* Logo FT */}
              <Link href="https://lafrenchtechest.fr/" className="hover:opacity-90 transition">
                <Image
                  src="/icons/Logo_FT.png"
                  alt="Logo French Tech Est"
                  width={70}
                  height={70}
                  className="opacity-90"
                />
              </Link>

              {/* Label Atmosphère */}
              <Link href="/label" className="hover:opacity-90 transition mt-[-6px] sm:mt-[-15px]">
                <Image
                  src="/images/label-atmosphere-respectueuse.png"
                  alt="Label Atmosphère Respectueuse"
                  width={70}
                  height={70}
                  className="rounded-full"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bloc droit = logo Sonarmo + mentions légales */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
          <Image src="/Logo-app-header.png" alt="Sonarmo Logo" width={100} height={30} />
          <p className="text-xs">Sonarmo™</p>
          <Link href="/cgu" className="text-sm hover:underline">Conditions d&apos;utilisation &amp; Politique de confidentialité</Link>
          <Link href="/mentions-legales" className="text-sm hover:underline">Mentions légales</Link>
          <Link href="/conditions-vente" className="text-sm hover:underline">Conditions de vente</Link>
        </div>

      </div>
    </footer>
  );
}