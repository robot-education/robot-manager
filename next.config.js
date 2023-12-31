/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "./dist", // Changes the build output directory to `./dist/`.
    rewrites: async () => {
        return [
            // {
            //     source: "/api/:path*",
            //     destination: process.env.BACKEND_URL + "/:path*"
            // }
        ];
    }
};

export default nextConfig;
