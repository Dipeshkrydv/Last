import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import SessionProvider from "./SessionProvider";
import Providers from './providers';
import ToastProvider from '../components/ToastProvider';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pustaklinu",
  description: "Buy and sell old books nearby",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Providers>
            <ToastProvider>
              {children}
            </ToastProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
