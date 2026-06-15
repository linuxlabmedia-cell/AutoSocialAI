/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@autosocial/db", "@autosocial/trpc", "@autosocial/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

module.exports = nextConfig;
