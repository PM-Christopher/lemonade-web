// next.config.mjs

// Local uploads come back as http://<LARAVEL_API_URL host>/storage/..., so allow that in dev only.
const localBackend =
    process.env.NODE_ENV !== 'production' && process.env.LARAVEL_API_URL
        ? new URL(process.env.LARAVEL_API_URL)
        : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
    // `pnpm lint` runs ESLint 10 itself; Next 15's built-in lint step can't load it.
    eslint: { ignoreDuringBuilds: true },
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
            ...(localBackend
                ? [
                      {
                          protocol: localBackend.protocol.replace(':', ''),
                          hostname: localBackend.hostname,
                          port: localBackend.port,
                      },
                  ]
                : []),
        ],
    },
};

export default nextConfig;
