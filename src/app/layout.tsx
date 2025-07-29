import { Inter } from "next/font/google";
// import "../css/webflow.css";
// import "../css/cstack-4796e2.webflow.css";
// import "../css/normalize.css";
import "./globals.css";

import AppLayout from "@/components/layout/DefaultLayout";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Danvora | Business Automation Solutions",
  description: "Empowering businesses with cutting-edge automation solutions. Discover how Danvora can streamline your operations and drive growth.",
  keywords: ["business automation", "automation solutions", "Danvora", "business growth", "streamline operations"],
  openGraph: {
    title: "Home - Danvora",
    description: "Empowering businesses with innovative automation solutions for growth and efficiency.",
    type: "website",
  },
};


export default function RootLayout({ children }: any) {
  return (
   <AppLayout className={inter.className}>
    {children}
   </AppLayout>
  );
}
