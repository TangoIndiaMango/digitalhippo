/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },

    images: {
        remotePatterns: [
            {
                hostname: "localhost",
                pathname: "**",
                port: "3000",
                protocol: "http"
            }
        ]
    },
    output: "standalone"
}

module.exports = nextConfig
