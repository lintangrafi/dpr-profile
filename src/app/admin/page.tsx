'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { supabase, supabaseService } from '@/lib/supabase'
import { Project, Category, ProjectImage } from '@/types/database'
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  Building2,
  Settings,
  LogOut,
  Save,
  Eye
} from 'lucide-react'

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('') // Add email state

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    client_name: '',
    location: '',
    completion_date: '',
    category_id: '',
    is_featured: false,
    status: 'completed' as 'completed' | 'ongoing' | 'planning'
  })

  // Add state for existing images during editing
  const [existingImages, setExistingImages] = useState<any[]>([])

  useEffect(() => {
    // Check admin authentication (now using Supabase Auth)
    const checkAdminAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAdmin(true);
        await fetchData();
      }
    };
    checkAdminAuth();
  }, [])

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsAdmin(true);
      await fetchData();
      // Store a simple flag to remember admin login state
      localStorage.setItem('admin_logged_in', 'true');
    } catch (error) {
      console.error('Login error:', error);
      alert('Email atau password salah!');
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    }
    setIsAdmin(false);
    localStorage.removeItem('admin_logged_in');
    setPassword('');
    setEmail('');
  }

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ])

      if (projectsRes.error) throw projectsRes.error
      if (categoriesRes.error) throw categoriesRes.error

      setProjects(projectsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = async (title: string) => {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists and append a number if needed
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', uniqueSlug)
        .single();

      if (!data || error) {
        // No conflict found, we can use this slug
        break;
      }

      // Try next slug with counter
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  const handleTitleChange = async (title: string) => {
    const uniqueSlug = await generateSlug(title);
    setFormData(prev => ({
      ...prev,
      title,
      slug: uniqueSlug
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedImages(prev => [...prev, ...files])

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteExistingImage = async (imageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus gambar ini?')) return;

    try {
      // Remove from Supabase storage (get the image URL first to delete from storage)
      const { data: imageToDelete, error: fetchError } = await supabase
        .from('project_images')
        .select('image_url, image_name')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Extract file name from URL to delete from storage
      const imageUrl = imageToDelete.image_url;
      const fileName = imageUrl.split('/').pop(); // Get the filename from the URL

      // Delete from storage
      if (fileName) {
        await supabase.storage
          .from('project-images')
          .remove([fileName]);
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) throw deleteError;

      // Update the existing images state to remove the deleted image
      setExistingImages(prev => prev.filter(img => img.id !== imageId));

      alert('Gambar berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Gagal menghapus gambar. Silakan coba lagi.');
    }
  }

  const uploadImagesToSupabase = async (projectId: string) => {
    const uploadedUrls: string[] = []

    for (const file of uploadedImages) {
      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
          console.error(`Invalid file type: ${file.type}`)
          alert(`File ${file.name} has unsupported type. Only JPG, PNG, and WebP are allowed.`)
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error(`File too large: ${file.name}`)
          alert(`File ${file.name} is too large. Maximum size is 5MB.`)
          continue
        }

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${file.name}`
        const { data, error } = await supabase.storage
          .from('project-images')
          .upload(fileName, file)

        if (error) {
          console.error('Error uploading image:', error)
          alert(`Failed to upload ${file.name}: ${error.message}`)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)

        // Save to database
        const { error: dbError } = await supabase.from('project_images').insert({
          project_id: projectId,
          image_url: publicUrl,
          image_name: file.name,
          alt_text: formData.title || 'Project image',
          sort_order: uploadedUrls.length - 1
        })

        if (dbError) {
          console.error('Database error:', dbError)
          alert(`Failed to save image ${file.name} to database: ${dbError.message}`)
          continue
        }
      } catch (uploadError) {
        console.error('Unexpected error uploading image:', uploadError)
        alert(`Unexpected error uploading ${file.name}`)
      }
    }

    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Insert project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          client_name: formData.client_name,
          location: formData.location,
          completion_date: formData.completion_date || null,
          category_id: formData.category_id || null,
          is_featured: formData.is_featured,
          status: formData.status
        })
        .select()
        .single()

      if (projectError) throw projectError

      // Upload images if any
      if (uploadedImages.length > 0) {
        await uploadImagesToSupabase(projectData.id)
      }

      // Reset form and close modal
      setFormData({
        title: '',
        slug: '',
        description: '',
        client_name: '',
        location: '',
        completion_date: '',
        category_id: '',
        is_featured: false,
        status: 'completed'
      })
      setUploadedImages([])
      setImagePreviewUrls([])
      setIsCreateModalOpen(false)

      // Refresh data
      fetchData()

      alert('Project berhasil dibuat!')
    } catch (error: any) {
      console.error('Error creating project:', error)
      alert(`Gagal membuat project. ${error?.message || 'Silakan coba lagi.'}`)
    }
  }

  const handleEdit = async (project: Project) => {
    setCurrentProject(project)
    // For editing, we keep the original slug to avoid conflicts, but if the title changes, we generate a new one
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description || '',
      client_name: project.client_name || '',
      location: project.location || '',
      completion_date: project.completion_date || '',
      category_id: project.category_id || '',
      is_featured: project.is_featured,
      status: project.status
    })

    // Fetch existing images for this project
    const { data: existingImages, error: imagesError } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', project.id)
      .order('sort_order')

    if (imagesError) {
      console.error('Error fetching existing images:', imagesError)
    } else {
      setExistingImages(existingImages || [])
    }

    // Clear any previously uploaded images for this edit session
    setUploadedImages([])
    setImagePreviewUrls([])
    setIsCreateModalOpen(false) // Close create modal if open
    setIsEditModalOpen(true)
  }

  const handleTitleChangeEdit = async (title: string) => {
    const uniqueSlug = await generateSlug(title);
    setFormData(prev => ({
      ...prev,
      title,
      slug: uniqueSlug
    }))
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentProject) return

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          client_name: formData.client_name,
          location: formData.location,
          completion_date: formData.completion_date || null,
          category_id: formData.category_id || null,
          is_featured: formData.is_featured,
          status: formData.status
        })
        .eq('id', currentProject.id)

      if (error) throw error

      // Upload new images if any
      if (uploadedImages.length > 0) {
        await uploadImagesToSupabase(currentProject.id)
      }

      setIsEditModalOpen(false)
      setCurrentProject(null)
      // Reset form data to clean state
      setFormData({
        title: '',
        slug: '',
        description: '',
        client_name: '',
        location: '',
        completion_date: '',
        category_id: '',
        is_featured: false,
        status: 'completed'
      });
      setExistingImages([])
      setUploadedImages([])
      setImagePreviewUrls([])

      fetchData()
      alert('Project berhasil diperbarui!')
    } catch (error: any) {
      console.error('Error updating project:', error)
      alert(`Gagal memperbarui project. ${error?.message || 'Silakan coba lagi.'}`)
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus project ini?')) return

    try {
      // Delete project and related images (due to cascade delete)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      fetchData()
      alert('Project berhasil dihapus!')
    } catch (error: any) {
      console.error('Error deleting project:', error)
      alert(`Gagal menghapus project. ${error?.message || 'Silakan coba lagi.'}`)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Masuk untuk mengelola website PT. Daya Prana Raya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email admin"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Masuk
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Gunakan email dan password admin Supabase Anda
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">PT. Daya Prana Raya</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Project</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-500">Selesai</p>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-500">Berjalan</p>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.status === 'ongoing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm text-gray-500">Unggulan</p>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.is_featured).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manajemen Project</CardTitle>
                <CardDescription>
                  Kelola project-project PT. Daya Prana Raya
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tambah Project Baru</DialogTitle>
                      <DialogDescription>
                        Tambahkan project baru ke portfolio
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Judul Project</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={async (e) => {
                              await handleTitleChange(e.target.value)
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="client_name">Nama Klien</Label>
                          <Input
                            id="client_name"
                            value={formData.client_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Lokasi</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="completion_date">Tanggal Selesai</Label>
                          <Input
                            id="completion_date"
                            type="date"
                            value={formData.completion_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Kategori</Label>
                          <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Selesai</SelectItem>
                              <SelectItem value="ongoing">Berjalan</SelectItem>
                              <SelectItem value="planning">Perencanaan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked as boolean }))}
                        />
                        <Label htmlFor="is_featured">Tampilkan di halaman utama</Label>
                      </div>

                      <div>
                        <Label htmlFor="images">Upload Gambar</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            id="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label htmlFor="images" className="cursor-pointer">
                            <div className="text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                              <p className="text-xs text-gray-500">Support: JPG, PNG, WebP (Max 5MB)</p>
                            </div>
                          </label>
                        </div>

                        {imagePreviewUrls.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-4">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsCreateModalOpen(false);
                            // Reset form data to clean state
                            setFormData({
                              title: '',
                              slug: '',
                              description: '',
                              client_name: '',
                              location: '',
                              completion_date: '',
                              category_id: '',
                              is_featured: false,
                              status: 'completed'
                            });
                            setUploadedImages([]);
                            setImagePreviewUrls([]);
                          }}
                        >
                          Batal
                        </Button>
                        <Button type="submit">
                          <Save className="w-4 h-4 mr-2" />
                          Simpan Project
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Edit Dialog - Separate dialog for editing */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Project</DialogTitle>
                      <DialogDescription>
                        Edit project details
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Judul Project</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={async (e) => {
                              await handleTitleChangeEdit(e.target.value)
                            }}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug</Label>
                          <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="client_name">Nama Klien</Label>
                          <Input
                            id="client_name"
                            value={formData.client_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Lokasi</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="completion_date">Tanggal Selesai</Label>
                          <Input
                            id="completion_date"
                            type="date"
                            value={formData.completion_date}
                            onChange={(e) => setFormData(prev => ({ ...prev, completion_date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Kategori</Label>
                          <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Selesai</SelectItem>
                              <SelectItem value="ongoing">Berjalan</SelectItem>
                              <SelectItem value="planning">Perencanaan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked as boolean }))}
                        />
                        <Label htmlFor="is_featured">Tampilkan di halaman utama</Label>
                      </div>

                      <div>
                        <Label htmlFor="images">Upload Gambar</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            id="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label htmlFor="images" className="cursor-pointer">
                            <div className="text-center">
                              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                              <p className="text-xs text-gray-500">Support: JPG, PNG, WebP (Max 5MB)</p>
                            </div>
                          </label>
                        </div>

                        {imagePreviewUrls.length > 0 && (
                          <div className="grid grid-cols-4 gap-2 mt-4">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditModalOpen(false);
                            setCurrentProject(null);
                            // Reset form data to clean state
                            setFormData({
                              title: '',
                              slug: '',
                              description: '',
                              client_name: '',
                              location: '',
                              completion_date: '',
                              category_id: '',
                              is_featured: false,
                              status: 'completed'
                            });
                            setUploadedImages([]);
                            setImagePreviewUrls([]);
                          }}
                        >
                          Batal
                        </Button>
                        <Button type="submit">
                          <Save className="w-4 h-4 mr-2" />
                          Update Project
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Judul</th>
                      <th className="text-left p-2">Klien</th>
                      <th className="text-left p-2">Kategori</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Unggulan</th>
                      <th className="text-left p-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{project.title}</p>
                            <p className="text-sm text-gray-500">{project.slug}</p>
                          </div>
                        </td>
                        <td className="p-2">{project.client_name || '-'}</td>
                        <td className="p-2">
                          {categories.find(c => c.id === project.category_id)?.name || '-'}
                        </td>
                        <td className="p-2">
                          <Badge className={
                            project.status === 'completed' ? 'bg-green-500' :
                            project.status === 'ongoing' ? 'bg-blue-500' : 'bg-yellow-500'
                          }>
                            {project.status === 'completed' ? 'Selesai' :
                             project.status === 'ongoing' ? 'Berjalan' : 'Perencanaan'}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {project.is_featured ? (
                            <Badge className="bg-orange-500">Ya</Badge>
                          ) : (
                            <span className="text-gray-400">Tidak</span>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(project)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(project.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {projects.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada project</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}