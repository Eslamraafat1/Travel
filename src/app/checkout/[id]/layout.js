import { pageMetadata } from "@/lib/site";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return pageMetadata({ title: "Checkout", path: `/checkout/${id}`, noindex: true });
}

export default function Layout({ children }) {
  return children;
}
