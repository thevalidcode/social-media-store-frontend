export type BlogStatus= "ACTIVE" | "DISABLED"

export type Blog = {
  id: number;
  uid: string;
  slug: string;
  title: string;
  storeScopedId: number;
  coverImage: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};
