import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Developer Analytics — GitHub Profile Visualizer",
  description:
    "A premium lens into any developer's public GitHub footprint. Search a username to visualize their code, languages, repositories, and core metrics.",
  keywords: [
    "GitHub",
    "developer analytics",
    "profile visualizer",
    "open source",
    "repositories",
    "programming languages",
  ],
  authors: [{ name: "VEINNIV", url: "https://github.com/VEINNIV" }],
  openGraph: {
    title: "Developer Analytics — GitHub Profile Visualizer",
    description:
      "Search any GitHub username to visualize their code, languages, and core projects with a premium glassmorphism UI.",
    url: "https://github-dashboard-hazel.vercel.app",
    siteName: "Developer Analytics",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Analytics — GitHub Profile Visualizer",
    description:
      "Search any GitHub username to visualize their code, languages, and core projects.",
  },
  metadataBase: new URL("https://github-dashboard-hazel.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Inline script to apply dark class before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme'),m=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t===null&&m)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
