/** Static export: `npm run build` writes a plain site to /out that works on Vercel or GitHub Pages. */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
