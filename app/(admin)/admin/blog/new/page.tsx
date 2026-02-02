import { requireAdmin } from "@/lib/auth-server";
import { PageHeader } from "@/app/admin/_components/PageHeader";
import { BlogEditor } from "@/app/(admin)/admin/blog/_components/BlogEditor";

export const dynamic = "force-dynamic";

export default async function AdminBlogNewPage() {
  await requireAdmin(["superadmin", "admin", "editor"]);

  return (
    <div>
      <PageHeader title="Nový článek" description="Vytvoření článku" />
      <div className="mt-6">
        <BlogEditor
          mode="create"
          initial={{ title: "", excerpt: "", content: null, coverImagePath: null, published: false }}
        />
      </div>
    </div>
  );
}

