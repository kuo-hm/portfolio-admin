/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', process.env.NEXT_PUBLIC_API_DOMAIN].filter(Boolean),
    },
}

module.exports = nextConfig 