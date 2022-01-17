let app: URL;
if (typeof window !== 'undefined') {
  app = new URL(window.location.origin);
} else {
  app = new URL(process.env.VERCEL_URL!);
}

export const url = {
  app,
  api: new URL(process.env.NEXT_PUBLIC_WP_API_BASE!),
};
