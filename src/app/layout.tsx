import type { Metadata } from "next";
import "./styles/layout.scss";
import Navbar from "./components/Navbar";
import Stars from "./components/Stars";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { Press_Start_2P, Tektur, Kalam } from "next/font/google";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
  preload: true,
});

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tektur",
  display: "swap",
  preload: true,
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Next Level",
  description: "Next Level K-pop Party",
  icons: {
    icon: "/images/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${tektur.variable} ${pressStart.variable} ${kalam.variable}`}
      >
        <AuthProvider>
          <div className="layout-container">
            <Stars />
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
