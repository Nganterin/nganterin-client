import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import NavbarComponent from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flight and Hotel Reservations Services",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}, text-white bg-orange-50 min-h-screen`}
      >
        <Providers>
          <div className="sticky top-0 w-full z-50">
            <NavbarComponent />
          </div>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
