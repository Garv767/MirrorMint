import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "MirrorMint | Strategy Console",
  description: "Enterprise-grade trading strategy management platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full bg-white flex flex-col font-poppins">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
