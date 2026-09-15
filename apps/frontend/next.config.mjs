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
        // domains -> remotePatterns per docs/ARCHITECTURE.md Phase 3 — narrowed
        // to the two hosts real uploaded/served images actually come from
        // (confirmed via grep: no code references images.unsplash.com or
        // encrypted-tbn0.gstatic.com, the two dropped here).
        remotePatterns: [
            { protocol: 'https', hostname: 'dev-lemonade-bucket.lon1.digitaloceanspaces.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
    },
};

export default nextConfig;
