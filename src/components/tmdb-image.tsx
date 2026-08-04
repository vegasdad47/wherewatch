/**
 * Plain <img> replacement for next/image for TMDB images.
 * TMDB already serves optimized WebP images — Vercel reprocessing them
 * is redundant and costs $59.95/month in image optimization fees.
 */
interface TmdbImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Default "w500" */
  loading?: "lazy" | "eager";
  /** CSS object-fit. Default "cover" */
  fit?: "cover" | "contain";
}

export function TmdbImage({ src, alt, className = "", loading = "lazy", fit = "cover" }: TmdbImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit }}
    />
  );
}
