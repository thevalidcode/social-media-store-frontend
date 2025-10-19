export type Blog = {
  id: number;
  slug: string; // slug or uid
  title: string;
  img: string;
  excerpt: string;
  content: string; // html
  status: "active" | "draft" | "disabled";
  createdAt: string; // ISO
  updatedAt: string; // ISO
};
