/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'imgproxy-uoerybu6tq-de.a.run.app'],
  },

}

module.exports = nextConfig
