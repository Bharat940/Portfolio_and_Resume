import { LucideIcon } from "lucide-react";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  authorId: string;
  category: string | null;
  icon: string | null;
  tags: string[] | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentData {
  id: string;
  postSlug: string;
  content: string;
  userId: string | null;
  authorName: string;
  authorAvatar: string | null;
  likes: number;
  reactions?: Record<string, string[]> | null;
  parentId: string | null;
  createdAt: Date;
  replies?: CommentData[];
}

export type IconMap = Record<string, LucideIcon>;
