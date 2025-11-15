# PT. Daya Prana Raya - Company Profile Website

Website company profile modern untuk PT. Daya Prana Raya dengan fitur lengkap untuk menampilkan portfolio project dan admin dashboard.

## 🚀 Fitur

### ✨ Fitur Utama
- **Homepage Modern** dengan company profile dan animated project preview
- **Project Portfolio** dengan filtering dan sorting
- **Project Detail** dengan image gallery yang interaktif
- **Admin Dashboard** untuk mengelola projects dan categories
- **Multi-Image Upload** dengan drag & drop support
- **Responsive Design** untuk semua device
- **SEO Optimized** dengan meta tags yang proper

### 🛠️ Teknologi
- **Framework**: Next.js 15 dengan App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage untuk images
- **Deployment**: Netlify (ready)

## 📋 Prerequisites

- Node.js 18+
- Akun Supabase
- Akun Netlify (untuk deployment)

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone <repository-url>
cd pt-daya-prana-raya
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Buat file `.env.local` dengan konfigurasi berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Setup Supabase Database

1. Buka Supabase dashboard
2. Buat project baru atau gunakan existing project
3. Jalankan SQL berikut di SQL Editor:

```sql
-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  client_name VARCHAR(200),
  location VARCHAR(200),
  completion_date DATE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing', 'planning')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_images table
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_name VARCHAR(200),
  alt_text VARCHAR(200),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_sort_order ON project_images(sort_order);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Design and Build', 'design-and-build', 'Jasa konstruksi secara menyeluruh yang meliputi perencanaan awal, desain, detail penanganan hingga konstruksi'),
('Building Maintenance', 'building-maintenance', 'Jasa Pemeliharaan secara menyeluruh yang meliputi perawatan, perbaikan, dan solusi permasalahan bangunan'),
('Pipe Installation', 'pipe-installation', 'Instalasi pipa dan sistem plumbing'),
('Electrical Installation', 'electrical-installation', 'Instalasi sistem listrik dan kelistrikan'),
('Waterproofing', 'waterproofing', 'Sistem waterproofing untuk bangunan');

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Project images are viewable by everyone" ON project_images FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage project images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
```

4. Buat storage bucket untuk images:
   - Buka Storage section
   - Create new bucket dengan nama `project-images`
   - Set bucket sebagai public

### 5. Run Development Server
```bash
npm run dev
```

Buka `http://localhost:3000` untuk melihat website.

## 🔐 Admin Access

- URL: `/admin`
- Password: `admin123` (untuk demo)

## 🚀 Deployment ke Netlify

### 1. Connect ke Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod
```

### 2. Setup Environment Variables di Netlify
1. Buka Netlify dashboard
2. Pilih site → Site settings → Environment variables
3. Tambahkan variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Custom Domain
1. Di Netlify dashboard → Domain settings
2. Add custom domain
3. Update DNS records sesuai instruksi Netlify

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin dashboard
│   ├── projects/              # Project pages
│   │   ├── [slug]/           # Dynamic project detail
│   │   └── page.tsx          # Projects listing
│   ├── api/                  # API routes
│   │   ├── projects/         # Project CRUD
│   │   └── upload/           # Image upload
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Utility functions
└── types/
    └── database.ts           # TypeScript types
```

## 🎨 Customization

### Colors & Theme
- Edit `tailwind.config.ts` untuk custom colors
- Theme variables ada di `src/app/globals.css`

### Components
- Semua components menggunakan shadcn/ui
- Custom components di `src/components/`

### Content
- Edit text content di halaman pages
- Update company info di homepage

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

Project ini adalah proprietary untuk PT. Daya Prana Raya.

## 🆘 Support

Untuk bantuan atau pertanyaan:
- Email: dayapranaraya@gmail.com
- Phone: 0813-1198-5588 (Rino), 0877-7454-5867 (Afani)

---

© 2024 PT. Daya Prana Raya. All rights reserved.