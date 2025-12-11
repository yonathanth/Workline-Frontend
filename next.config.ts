import 'dotenv/config';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/organizations/:organizationId/outlines/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/organizations/:organizationId/outlines/:path*`,
      },
      {
        source: '/api/organizations/:organizationId/outlines',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/organizations/:organizationId/outlines`,
      },
      {
        source: '/api/organizations/:organizationId/members/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/organizations/:organizationId/members/:path*`,
      },
      {
        source: '/api/organizations/:organizationId/members',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/organizations/:organizationId/members`,
      },
      {
        source: '/api/organizations/:organizationId/invitations',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/organizations/:organizationId/invitations`,
      },
      {
        source: '/api/invitations/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/invitations/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/:path*`,
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
