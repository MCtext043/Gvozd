import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Скрыть плавающую кнопку Next.js Dev Tools («N») в режиме разработки
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "https", hostname: "izhgvozd.ru", pathname: "/**" },
      { protocol: "https", hostname: "**.izhgvozd.ru", pathname: "/**" },
      { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
