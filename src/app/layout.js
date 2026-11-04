import { Outfit, Cairo } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { SITE, SITE_URL, absoluteUrl, jsonLd } from "@/lib/site";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime request to Google Fonts).
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap", variable: "--font-cairo" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s | ${SITE.name}` },
  description: SITE.description,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE_URL,
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    images: [SITE.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage.url],
  },
};

export const viewport = {
  themeColor: "#ff6b35",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  url: SITE_URL,
  description: SITE.description,
  email: SITE.email,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", ...SITE.address },
  openingHours: SITE.openingHours,
  image: SITE.ogImage.url,
  areaServed: { "@type": "Country", name: "Egypt" },
  availableLanguage: ["ar", "en"],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE.name,
  url: absoluteUrl("/"),
  inLanguage: ["ar", "en"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Language is a client-side preference (localStorage, no /ar or /en URLs), so
// the server renders the default (Arabic, RTL) and this script applies a saved
// preference before first paint to avoid a direction flash.
const LANG_SCRIPT = `(function(){try{var l=localStorage.getItem("app-lang");if(l!=="en"&&l!=="ar")l="ar";var d=document.documentElement;d.lang=l;d.dir=l==="ar"?"rtl":"ltr";var t=localStorage.getItem("tourism-theme");d.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light" className={`${outfit.variable} ${cairo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([organizationLd, websiteLd])} />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <ThemeProvider>
              {children}
              <ScrollToTop />
            </ThemeProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
