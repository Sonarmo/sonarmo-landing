import { Menu } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  let currentLang = "fr";
  if (pathname.includes("-en")) currentLang = "en";
  if (pathname.includes("-es")) currentLang = "es";

  const flags = {
    fr: { label: "FR", src: "/flags/fr.png" },
    en: { label: "EN", src: "/flags/gb.png" },
    es: { label: "ES", src: "/flags/es.png" },
  };

  // ✅ Gestion spéciale pour la homepage
  const isHomePage =
    pathname === "/" ||
    pathname === "/index-en" ||
    pathname === "/index-es";

  const getPathForLang = (lang) => {
    if (isHomePage) {
      if (lang === "fr") return "/";
      return `/index-${lang}`;
    }

    // Sinon, on reconstruit la route en remplaçant le suffixe
    const basePath = pathname
      .replace("-fr", "")
      .replace("-en", "")
      .replace("-es", "");

    if (lang === "fr") return basePath;
    return `${basePath}-${lang}`;
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <Menu.Button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border px-2 py-1 rounded">
        <Image src={flags[currentLang].src} alt={flags[currentLang].label} width={20} height={14} />
        {flags[currentLang].label}
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-[#1c1c1c] border border-gray-600 rounded-md shadow-lg focus:outline-none">
        <div className="py-1">
          {Object.entries(flags).map(([lang, { label, src }]) => (
            <Menu.Item key={lang}>
              <Link
                href={getPathForLang(lang)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
              >
                <Image src={src} alt={label} width={20} height={14} />
                {label}
              </Link>
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}