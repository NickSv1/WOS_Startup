import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Knodle — the AI-powered savings coach",
  description:
    "The AI-powered savings coach that keeps you on track without the boring spreadsheets. Try the live demo after entering your email.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-sans antialiased">
        <form
          name="waitlist"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          hidden
        >
          <input type="hidden" name="form-name" value="waitlist" />
          <input type="text" name="bot-field" />
          <input type="email" name="email" />
        </form>
        {children}
      </body>
    </html>
  );
}
