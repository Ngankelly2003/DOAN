/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      "vnexpress.net",
      "i1-vnexpress.vnecdn.net",
      "i1-thethao.vnecdn.net",
      "i1-suckhoe.vnecdn.net",
      "i1-giaitri.vnecdn.net",
      "i1-dulich.vnecdn.net",
      "i1-giadinh.vnecdn.net",
      "i1-sohoa.vnecdn.net",
      "i1-kinhdoanh.vnecdn.net",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
