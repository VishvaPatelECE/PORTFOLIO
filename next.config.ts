import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "192.168.29.20", "*.trycloudflare.com"],
  experimental: {
    agentUpgrade: "security",
  },
};

export default config;
