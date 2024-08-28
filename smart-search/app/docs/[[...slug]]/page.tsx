import { notFound } from "next/navigation";
import { getMarkdownForSlug } from "@/lib/markdown";

type PageProps = {
  params: { slug: string[] };
};

export default async function DocsPage({ params }: PageProps) {
  const slug = params?.slug?.join('/') || 'getting-started';
  const data = await getMarkdownForSlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{data.frontmatter.title}</h1>
      <p className="text-muted-foreground">{data.frontmatter.description}</p>
      <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
}
