import type { Metadata } from "next";

// The admin pages are client components and can't export metadata
// themselves, so this layout marks everything under /admin as noindex.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
