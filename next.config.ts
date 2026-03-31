import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname: "img.clerk.com"
      },
      {
        protocol:"https",
        hostname: "img.clerk.dev"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // allow all paths from this host
      },
      {
        protocol:"https",
        hostname: "placehold.co"
      },
    ]
  }
};

export default nextConfig;
