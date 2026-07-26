import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { StoreHydrator } from "@/components/providers/store-hydrator";
import { PWA } from "@/components/providers/pwa";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Editorial serif for large display headings only — the typographic signature.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mahesh OS — Personal Operating System",
  description:
    "Your second brain. Manage life, health, projects, career, learning, and finances from one beautiful command center.",
  applicationName: "Mahesh OS",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Mahesh OS" },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <StoreHydrator />
          <PWA />
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "var(--elevated)",
                border: "1px solid var(--border-strong)",
                color: "var(--foreground)",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
