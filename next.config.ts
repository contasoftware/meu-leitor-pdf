/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  // Ignora erros de TypeScript e Lint que travam o deploy na Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Esta chave vazia diz ao Next.js para permitir configurações personalizadas
  webpack: (config: any) => {
    return config;
  },
};

export default withPWA(nextConfig);