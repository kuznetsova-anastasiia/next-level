import type { Metadata } from "next";
import "./styles/layout.scss";
import Navbar from "./components/Navbar";
import Stars from "./components/Stars";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import { Press_Start_2P, Tektur } from "next/font/google";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-tektur",
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
      <body className={`${tektur.variable} ${pressStart.variable}`}>
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
