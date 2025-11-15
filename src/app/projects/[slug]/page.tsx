'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase'
import { ProjectWithDetails } from '@/types/database'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Download,
  Eye,
  Clock,
  CheckCircle,
  Construction,
  Camera,
  Maximize2,
  Heart,
  MessageSquare,
  Star,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

export default function ProjectDetailPage() {
  const [project, setProject] = useState<ProjectWithDetails | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [liked, setLiked] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    // Fetch project from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const slug = urlParams.get('slug') || window.location.pathname.split('/').pop()
    
    if (slug) {
      fetchProject(slug)
    }
  }, [])

  const fetchProject = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          category:categories(*),
          images:project_images(*)
        `)
        .eq('slug', slug)
        .single()

      if (error) throw error
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      // Redirect to projects page if error
      window.location.href = '/projects'
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (project?.images && project.images.length > 0) {
      setImageLoading(true)
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prevImage = () => {
    if (project?.images && project.images.length > 0) {
      setImageLoading(true)
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.images.length - 1 : prev - 1
      )
    }
  }

  const goToImage = (index: number) => {
    setImageLoading(true)
    setCurrentImageIndex(index)
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

  const shareProject = async () => {
    if (navigator.share && project) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description || `Lihat project ${project.title} oleh PT. Daya Prana Raya`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link project telah disalin ke clipboard!')
    }
  }

  const downloadImage = () => {
    if (project?.images && project.images[currentImageIndex]) {
      const link = document.createElement('a')
      link.href = project.images[currentImageIndex].image_url
      link.download = `${project.title}-${currentImageIndex + 1}.jpg`
      link.click()
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Construction className="w-12 h-12 text-blue-600" />
          </motion.div>
          <p className="mt-4 text-gray-600">Memuat detail project...</p>
        </motion.div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Project tidak ditemukan</h2>
          <p className="text-gray-500 mb-4">Project yang Anda cari tidak tersedia.</p>
          <Link href="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Project
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const currentImage = project.images?.[currentImageIndex]
  const StatusIcon = getStatusIcon(project.status)

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
      </div>

      {/* Header */}
      <motion.section 
        className="bg-white border-b sticky top-0 z-40 shadow-sm backdrop-blur-sm bg-white/95"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/projects">
                <Button variant="outline" className="mb-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Project
                </Button>
              </Link>
            </motion.div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setLiked(!liked)}
                  className={liked ? 'text-red-600 border-red-600' : ''}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="outline" size="sm" onClick={shareProject}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Project Hero */}
      <motion.section 
        className="bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div 
            className="max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Gallery */}
              <motion.div 
                className="lg:w-2/3"
                variants={itemVariants}
              >
                <div className="relative">
                  {/* Main Image */}
                  <motion.div 
                    className="relative h-96 lg:h-[500px] bg-gray-100 rounded-xl overflow-hidden shadow-2xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence mode="wait">
                      {currentImage ? (
                        <motion.div
                          key={currentImageIndex}
                          className="relative w-full h-full"
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5 }}
                        >
                          <img
                            src={currentImage.image_url}
                            alt={currentImage.alt_text || project.title}
                            className="w-full h-full object-cover"
                            onLoad={() => setImageLoading(false)}
                          />
                          {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Camera className="w-8 h-8 text-gray-400" />
                              </motion.div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="w-full h-full flex items-center justify-center bg-gray-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Building2 className="w-16 h-16 text-gray-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Navigation Buttons */}
                    {project.images && project.images.length > 1 && (
                      <>
                        <motion.button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </motion.button>
                        <motion.button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ChevronRight className="w-6 h-6" />
                        </motion.button>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <motion.button
                        onClick={() => setIsFullscreen(true)}
                        className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </motion.button>
                      {currentImage && (
                        <motion.button
                          onClick={downloadImage}
                          className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors shadow-lg"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>

                    {/* Image Counter */}
                    {project.images && project.images.length > 1 && (
                      <motion.div
                        className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {currentImageIndex + 1} / {project.images.length}
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Thumbnail Gallery */}
                  {project.images && project.images.length > 1 && (
                    <motion.div 
                      className="flex gap-2 mt-4 overflow-x-auto pb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {project.images.map((image, index) => (
                        <motion.button
                          key={image.id}
                          onClick={() => goToImage(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'border-blue-600 shadow-lg scale-110'
                              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img
                            src={image.image_url}
                            alt={image.alt_text || `${project.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Project Info */}
              <motion.div 
                className="lg:w-1/3"
                variants={itemVariants}
              >
                <div className="sticky top-24">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Title and Status */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Badge className={`${getStatusColor(project.status)} shadow-lg flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {getStatusText(project.status)}
                          </Badge>
                        </motion.div>
                      </div>
                      
                      {project.category && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Badge variant="outline" className="mb-4 border-blue-600 text-blue-600">
                            {project.category.name}
                          </Badge>
                        </motion.div>
                      )}
                    </div>

                    {/* Project Details */}
                    <motion.div 
                      className="space-y-4 mb-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {project.client_name && (
                        <motion.div variants={itemVariants} className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <Users className="w-5 h-5 mr-3 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Klien</p>
                            <p className="font-medium">{project.client_name}</p>
                          </div>
                        </motion.div>
                      )}
                      
                      {project.location && (
                        <motion.div variants={itemVariants} className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="w-5 h-5 mr-3 text-red-600" />
                          <div>
                            <p className="text-sm text-gray-500">Lokasi</p>
                            <p className="font-medium">{project.location}</p>
                          </div>
                        </motion.div>
                      )}
                      
                      {project.completion_date && (
                        <motion.div variants={itemVariants} className="flex items-center text-gray-600 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 mr-3 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Tanggal Selesai</p>
                            <p className="font-medium">
                              {new Date(project.completion_date).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    <Separator className="my-6" />

                    {/* Description */}
                    {project.description && (
                      <motion.div 
                        className="mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                          Deskripsi Project
                        </h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                          {project.description}
                        </p>
                      </motion.div>
                    )}

                    {/* Image Count */}
                    {project.images && (
                      <motion.div 
                        className="text-sm text-gray-500 mb-6 flex items-center justify-center p-3 bg-blue-50 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Camera className="w-4 h-4 mr-2 text-blue-600" />
                        {project.images.length} foto dalam project ini
                      </motion.div>
                    )}

                    {/* CTA Buttons */}
                    <motion.div 
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/contact">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Diskusikan Project Serupa
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link href="/projects">
                          <Button variant="outline" className="w-full border-2 hover:bg-blue-600 hover:text-white transition-all duration-300">
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Project Lainnya
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Related Projects Placeholder */}
      {project.category && (
        <motion.section 
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Terkait</h2>
              <p className="text-lg text-gray-600">
                Project lainnya dalam kategori {project.category.name}
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/projects">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Lihat Semua Project
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && currentImage && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
          >
            <motion.img
              src={currentImage.image_url}
              alt={currentImage.alt_text || project.title}
              className="max-w-full max-h-full object-contain"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
            <motion.button
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
              onClick={() => setIsFullscreen(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-6 h-6 rotate-45" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}