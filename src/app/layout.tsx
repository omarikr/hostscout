import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "HostScout",
  description: "Discover and review the best hosting providers",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div id="toast-container" />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="border-t py-6 mt-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  2026 HostScout, Not affiliated with any legal services. Developed and managed by students.
                </p>
                <div className="flex gap-4 text-sm">
                  <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors no-underline font-bold">
                    Terms and Conditions
                  </a>
                  <a href="/info" className="text-muted-foreground hover:text-foreground transition-colors no-underline font-bold">
                    About
                  </a>
                  <a href="https://discord.gg/HCVSJj53t9" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors no-underline font-bold">
                    Discord
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
