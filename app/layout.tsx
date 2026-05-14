import type { Metadata, Viewport } from "next";
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

// Configuração de Metadados com suporte a PWA
export const metadata: Metadata = {
  title: "ReadPdf - Seu Leitor Multi-Abas",
  description: "Leitor de PDF com suporte a múltiplas abas e persistência local",
  manifest: "/manifest.json", // Importante: aponta para o seu arquivo de manifesto
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ReadPdf",
    // startupImage: "/icon-512x512.png", // Opcional: imagem de abertura no iPhone
  },
  formatDetection: {
    telephone: false, // Evita que o navegador confunda números no PDF com links de telefone
  },
};

// Configuração de Viewport para Mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb", // Cor da barra de status (usei o azul do seu botão)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Ícone para iPhone */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="h-full w-full overflow-hidden bg-gray-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}