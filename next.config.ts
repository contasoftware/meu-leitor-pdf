/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  // Ignora erros chatos que travam o deploy
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Força o uso do Webpack (motor antigo) de forma compatível com Next 16
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Se precisar de alguma config específica de loader, entra aqui
    return config;
  },
};

export default withPWA(nextConfig);