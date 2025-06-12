import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth"
import  SessionProvider  from "./hook/SessionProvider";
import Navbar from "./helpers/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MovieDB",
  description: "Movie Recommendation System",
  icons: {
    icon: './favicon.ico'
  }
};

export default async function RootLayout({ children }) {
  const session = await getServerSession()
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black/90`}>
          <SessionProvider session={session}>
            {children}
            </SessionProvider>
      </body>
    </html>
  );
}
