import { Inter } from "next/font/google";
import "./globals.css";
import TopNavigation from "../components/topnav";
import SigninBar from "@/components/signinbar";
import localfont from 'next/font/local';


const inter = Inter({ subsets: ["latin"] });
const Khand = localfont({
  src: [
    {
      path: "../../public/fonts/Khand-Regular.ttf",
    },
  ],
  variable: "--font-khand",
});

const KhandBold = localfont({
  src: [
    {
      path: "../../public/fonts/Khand-Bold.ttf",
    },
  ],
  variable: "--font-khandbold",
});

const KhandMedium = localfont({
  src: [
    {
      path: "../../public/fonts/Khand-Medium.ttf",
    },
  ],
  variable: "--font-khandmedium",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};



export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body className={`${Khand.variable} ${KhandBold.variable} ${KhandMedium.variable}`}>

        <TopNavigation />

        <div> {children}</div>

      </body>
    </html>
  );
}
