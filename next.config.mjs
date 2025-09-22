// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: { icon: true },
                },
            ],
        });
        return config;
    },
    images: {
        domains: [
            'images.unsplash.com',
            'dev-lemonade-bucket.lon1.digitaloceanspaces.com',
            'encrypted-tbn0.gstatic.com',
            'res.cloudinary.com',
        ],
    },
    async rewrites() {
        return [
            {
                source: '/firebase-messaging-sw.js',
                destination: '/firebase-messaging-sw.js',
            },
        ];
    },
    async headers() {
        return [
            {
                source: '/firebase-messaging-sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
