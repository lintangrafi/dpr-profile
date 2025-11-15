export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  client_name?: string;
  location?: string;
  completion_date?: string;
  category_id?: string;
  is_featured: boolean;
  status: 'completed' | 'ongoing' | 'planning';
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  image_name?: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

export interface ProjectWithDetails extends Project {
  category: Category;
  images: ProjectImage[];
}