'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { ProjectWithDetails, Category } from '@/types/database'
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  ChevronRight, 
  ArrowRight,
  Calendar,
  Users,
  Image as ImageIcon,
  Construction,
  Eye,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchTerm, selectedCategory, sortBy])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          category:categories(*),
          images:project_images(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category?.slug === selectedCategory)
    }

    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'client':
        filtered.sort((a, b) => (a.client_name || '').localeCompare(b.client_name || ''))
        break
    }

    setFilteredProjects(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'ongoing':
        return 'bg-blue-500'
      case 'planning':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'ongoing':
        return 'Sedang Berjalan'
      case 'planning':
        return 'Perencanaan'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'ongoing':
        return Construction
      case 'planning':
        return Clock
      default:
        return Clock
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Header */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Construction className="w-16 h-16 mx-auto mb-4 text-blue-200" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Semua Project</h1>
            <p className="text-xl text-blue-100">
              Portfolio lengkap proyek-proyek yang telah kami kerjakan dengan dedikasi dan kualitas terbaik.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Filters Section */}
      <motion.section 
        className="bg-white border-b sticky top-0 z-10 shadow-lg backdrop-blur-sm bg-white/95"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <motion.div
                animate={{ x: searchTerm ? 5 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari project berdasarkan nama, klien, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 focus:border-blue-500 transition-colors"
                />
              </motion.div>
            </div>
            
            <div className="flex gap-4 w-full lg:w-auto">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-48 border-2 focus:border-blue-500 transition-colors">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48 border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="name">Nama Project</SelectItem>
                    <SelectItem value="client">Nama Klien</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Construction className="w-12 h-12 text-blue-600" />
              </motion.div>
              <p className="mt-4 text-gray-600">Memuat project...</p>
            </motion.div>
          ) : filteredProjects.length > 0 ? (
            <>
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="inline-block px-6 py-3 bg-blue-50 border-blue-200">
                  <p className="text-gray-700">
                    Menampilkan <span className="font-bold text-blue-600">{filteredProjects.length}</span> project
                    {selectedCategory !== 'all' && (
                      <span> dalam kategori <span className="font-semibold">"{categories.find(c => c.slug === selectedCategory)?.name}"</span></span>
                    )}
                    {searchTerm && (
                      <span> untuk pencarian <span className="font-semibold">"{searchTerm}"</span></span>
                    )}
                  </p>
                </Card>
              </motion.div>
              
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {filteredProjects.map((project, index) => {
                    const StatusIcon = getStatusIcon(project.status)
                    return (
                      <motion.div
                        key={project.id}
                        variants={itemVariants}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -10 }}
                      >
                        <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                          <div className="relative h-64 overflow-hidden bg-gray-100">
                            {project.images && project.images.length > 0 ? (
                              <motion.img
                                src={project.images[0]?.image_url}
                                alt={project.images[0]?.alt_text || project.title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Building2 className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                            />
                            
                            {project.category && (
                              <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Badge className="absolute top-4 left-4 bg-blue-600 shadow-lg">
                                  {project.category.name}
                                </Badge>
                              </motion.div>
                            )}
                            
                            <motion.div
                              initial={{ x: 50, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Badge className={`absolute top-4 right-4 ${getStatusColor(project.status)} shadow-lg flex items-center gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {getStatusText(project.status)}
                              </Badge>
                            </motion.div>

                            <motion.div
                              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                            >
                              <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                            </motion.div>
                          </div>
                          
                          <CardContent className="p-6">
                            <motion.h3 
                              className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors"
                              whileHover={{ x: 5 }}
                            >
                              {project.title}
                            </motion.h3>
                            
                            {project.client_name && (
                              <motion.div 
                                className="flex items-center text-sm text-gray-600 mb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <Users className="w-4 h-4 mr-2 text-blue-500" />
                                {project.client_name}
                              </motion.div>
                            )}
                            
                            {project.location && (
                              <motion.div 
                                className="flex items-center text-sm text-gray-600 mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                                {project.location}
                              </motion.div>
                            )}
                            
                            {project.description && (
                              <motion.p 
                                className="text-gray-600 mb-4 line-clamp-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                {project.description}
                              </motion.p>
                            )}
                            
                            <motion.div 
                              className="flex items-center justify-between mb-4"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                            >
                              {project.completion_date && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-4 h-4 mr-1 text-green-500" />
                                  {new Date(project.completion_date).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              )}
                              {project.images && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <ImageIcon className="w-4 h-4 mr-1 text-purple-500" />
                                  {project.images.length} foto
                                </div>
                              )}
                            </motion.div>
                            
                            <Link href={`/projects/${project.slug}`}>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border-2 group-hover:border-blue-600">
                                  Lihat Detail
                                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </motion.div>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada project ditemukan</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Coba ubah filter atau kata kunci pencarian Anda.'
                  : 'Belum ada project yang tersedia saat ini.'}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { value: filteredProjects.length, label: 'Total Project', icon: Building2, color: 'text-blue-600', bgColor: 'bg-blue-50' },
              { value: filteredProjects.filter(p => p.status === 'completed').length, label: 'Selesai', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
              { value: filteredProjects.filter(p => p.status === 'ongoing').length, label: 'Berjalan', icon: Construction, color: 'text-orange-600', bgColor: 'bg-orange-50' },
              { value: categories.length, label: 'Kategori', icon: Filter, color: 'text-purple-600', bgColor: 'bg-purple-50' }
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <motion.div 
                      className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </motion.div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: [-100, 100] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Tertarik dengan Project Kami?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Mari diskusikan kebutuhan konstruksi dan pemeliharaan bangunan Anda dengan tim profesional kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-lg">
                    <Zap className="mr-2 h-5 w-5" />
                    Hubungi Kami
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 px-8 py-6 text-lg font-semibold shadow-lg">
                    Kembali ke Beranda
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}