/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // three.js ships ESM that Next can transpile cleanly.
  transpilePackages: ['three'],
}

export default nextConfig
