import Links from "./components/links/links";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dollar blue - Kim",
  description: `Application to see the changes of the official dollar and "blue" in Argentina`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Links />
        {children}
      </body>
    </html>
  );
}
