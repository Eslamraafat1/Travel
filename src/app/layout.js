import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import "./globals.css";

export const metadata = {
  title: "Wanderlust - Discover the world with us",
  description: "Top travel packages and tours worldwide. Explore your dream destinations with Wanderlust Travel.",
  keywords: "travel, tours, packages, trips, Wanderlust",
  openGraph: {
    title: "Wanderlust - Discover the world with us",
    description: "Top travel packages and tours worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=localStorage.getItem("app-lang")||"ar";document.documentElement.dir=l==="ar"?"rtl":"ltr";document.documentElement.lang=l;})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <ScrollToTop />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
