/** @type {import('next').NextConfig} */
// const nextConfig = {
//   serverActions: {
//     bodySizeLimit: "10mb",
//   },
//   images: {
//     unoptimized: true,
//   },
// };

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
