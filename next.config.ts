import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // <-- Ez mondja meg a Next.js-nek, hogy statikus HTML/JS állományokat generáljon
  images: {
    unoptimized: true, // Statikus export esetén szükséges az képek kezeléséhez
  },
};

export default nextConfig;
