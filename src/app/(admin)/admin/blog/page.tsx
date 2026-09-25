import { getBlogPosts } from "@/server/queries/blog";
import { BlogClient } from "./blog-client";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts({ includeUnpublished: true });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <BlogClient initialData={posts} />
    </div>
  );
}
