import { compileMDX } from "next-mdx-remote/rsc";
import path from "path";
import { promises as fs } from "fs";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";

// Import custom components for MDX
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pre from "@/components/pre";
import Note from "@/components/note";
import { Stepper, StepperItem } from "@/components/ui/stepper";

// Define types for frontmatter
type MdxFrontmatter = {
  title: string;
  description: string;
};

// Custom components mapping for MDX
const components = {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  pre: Pre,
  Note,
  Stepper,
  StepperItem,
};

// Function to read and compile the MDX file for a given slug
export async function getMarkdownForSlug(slug: string) {
  try {
    const contentPath = getContentPath(slug);
    const rawMdx = await fs.readFile(contentPath, "utf-8");

    // Compile MDX content with custom components and plugins
    return await compileMDX<MdxFrontmatter>({
      source: rawMdx,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [
            preProcess,               // Custom pre-processing
            rehypeCodeTitles,         // Add titles to code blocks
            rehypePrism,              // Syntax highlighting
            rehypeSlug,               // Add slugs to headings
            rehypeAutolinkHeadings,   // Auto-link headings
            postProcess,              // Custom post-processing
          ],
          remarkPlugins: [remarkGfm],  // Support for GitHub Flavored Markdown
        },
      },
      components,
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getTocs(slug: string) {
  const contentPath = getContentPath(slug);
  const rawMdx = await fs.readFile(contentPath, "utf-8");
  
  // Regex to match headings of level 2, 3, and 4
  const headingsRegex = /^(#{2,4})\s(.+)$/gm;
  let match;
  const extractedHeadings = [];

  // Extract headings and generate TOC items
  while ((match = headingsRegex.exec(rawMdx)) !== null) {
    const headingLevel = match[1].length;
    const headingText = match[2].trim();
    const slug = sluggify(headingText);
    
    extractedHeadings.push({
      level: headingLevel,
      text: headingText,
      href: `#${slug}`,
    });
  }

  return extractedHeadings;
}

import { page_routes } from "./routes-config";

export function getPreviousNext(path: string) {
  const index = page_routes.findIndex(({ href }) => href === `/${path}`);
  
  return {
    prev: page_routes[index - 1] || null,
    next: page_routes[index + 1] || null,
  };
}

function sluggify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")          // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "");   // Remove special characters
}

function getContentPath(slug: string) {
  return path.join(process.cwd(), "contents/docs", `${slug}/index.mdx`);
}

import { visit } from "unist-util-visit";

// Pre-process MDX content
const preProcess = () => (tree: any) => {
  visit(tree, (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl.tagName !== "code") return;
      node.raw = codeEl.children?.[0].value;
    }
  });
};

// Post-process MDX content
const postProcess = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node?.type === "element" && node?.tagName === "pre") {
      node.properties["raw"] = node.raw;
    }
  });
};
