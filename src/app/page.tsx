'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import { Project, ProjectWithDetails } from '@/types/database'
import { 
  Building2, 
  Users, 
  Target, 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  ChevronRight, 
  ArrowRight,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowUpRight,
  Hammer,
  HardHat,
  FileText,
  Construction,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<ProjectWithDetails[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchFeaturedProjects()
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex: { [key: string]: number } = {}
        featuredProjects.forEach(project => {
          if (project.images && project.images.length > 1) {
            const current = prev[project.id] || 0
            newIndex[project.id] = (current + 1) % project.images.length
          } else {
            newIndex[project.id] = 0
          }
        })
        return newIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [featuredProjects])

  const handleScroll = () => {
    const sections = ['hero', 'about', 'services', 'projects', 'contact']
    sections.forEach(section => {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0
        setIsVisible(prev => ({ ...prev, [section]: isInView }))
      }
    })
  }

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          category:categories(*),
          images:project_images(*)
        `)
        .eq('is_featured', true)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeaturedProjects(data || [])
    } catch (error) {
      console.error('Error fetching featured projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      icon: Building2,
      title: 'Design and Build',
      description: 'Jasa konstruksi menyeluruh dari perencanaan hingga konstruksi',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      features: ['Perencanaan', 'Desain', 'Konstruksi', 'Pengawasan'],
      delay: 0
    },
    {
      icon: Wrench,
      title: 'Building Maintenance',
      description: 'Pemeliharaan dan perawatan bangunan secara berkala',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      features: ['Perawatan', 'Perbaikan', 'Inspeksi', 'Upgrade'],
      delay: 0.1
    },
    {
      icon: Zap,
      title: 'Mechanical & Electrical',
      description: 'Instalasi mekanik dan elektrik untuk bangunan',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      features: ['Instalasi', 'Pemeliharaan', 'Troubleshooting', 'Upgrade'],
      delay: 0.2
    },
    {
      icon: Target,
      title: 'Engineering Solutions',
      description: 'Solusi engineering yang inovatif dan berkualitas',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      features: ['Konsultasi', 'Desain', 'Analisis', 'Optimasi'],
      delay: 0.3
    }
  ]

  const achievements = [
    { icon: Shield, title: 'Kualitas Terjamin', description: 'Standar kualitas internasional' },
    { icon: TrendingUp, title: 'Efisiensi Biaya', description: 'Solusi hemat dan efektif' },
    { icon: Clock, title: 'Tepat Waktu', description: 'Pengerjaan sesuai jadwal' },
    { icon: Award, title: 'Berpengalaman', description: 'Tim ahli profesional' }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        id="hero"
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
            className="absolute top-40 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
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
          <motion.div
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
            animate={{
              x: [-50, 50, -50],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        
        <motion.div 
          className="relative w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="mb-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                PT. Daya Prana Raya
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl font-light mb-4 text-blue-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Civil Construction & Building Maintenance
              </motion.p>
              <motion.p 
                className="text-lg md:text-xl max-w-2xl mx-auto text-blue-50 leading-relaxed mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Perusahaan konstruksi terpercaya yang berkomitmen memberikan solusi terbaik 
                untuk kebutuhan bangunan dan infrastruktur Anda.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/projects">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-lg">
                    Lihat Portfolio
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#contact">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-lg">
                    Hubungi Kami
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about"
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={isVisible['about'] ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              animate={isVisible['about'] ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                PT. Daya Prana Raya merupakan perusahaan yang bergerak di bidang jasa konstruksi, 
                sipil, mekanik, elektrik, dan engineering.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={isVisible['about'] ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Visi & Misi Kami</h3>
                
                <motion.div 
                  className="mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible['about'] ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h4 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    Visi
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Menjadi penyedia layanan terkemuka yang berkelanjutan dan inovatif, memberikan 
                    solusi kreatif dan terbaik untuk kebutuhan mitra kami, serta terus memperluas 
                    jangkauan untuk menciptakan dampak positif yang lebih besar kepada masyarakat luas.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible['about'] ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h4 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
                    <Award className="w-6 h-6 mr-2" />
                    Misi
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Memberikan layanan konstruksi berkualitas tinggi yang memenuhi standar keamanan 
                    dan kepuasan pelanggan, dengan fokus pada keunggulan layanan, kreativitas, dan 
                    kolaborasi yang berkelanjutan.
                  </p>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={isVisible['about'] ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }}>
                      <Card className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-600">
                        <CardContent className="p-0">
                          <div className="flex items-center mb-2">
                            <achievement.icon className="w-8 h-8 text-blue-600 mr-3" />
                            <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="services"
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        animate={isVisible['services'] ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={isVisible['services'] ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kami menyediakan berbagai layanan konstruksi dan engineering yang komprehensif 
              untuk memenuhi kebutuhan proyek Anda.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible['services'] ? "visible" : "hidden"}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden group">
                    <div className={`h-2 ${service.color}`}></div>
                    <CardHeader className="text-center pb-4">
                      <motion.div 
                        className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <service.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <motion.div 
                            key={idx} 
                            className="flex items-center text-sm text-gray-600"
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * idx }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Projects Section */}
      <motion.section 
        id="projects"
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={isVisible['projects'] ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={isVisible['projects'] ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Proyek Unggulan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Beberapa proyek terbaik yang telah kami kerjakan dengan hasil yang memuaskan.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada proyek unggulan yang tersedia.</p>
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isVisible['projects'] ? "visible" : "hidden"}
            >
              {featuredProjects.map((project, index) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <AnimatePresence mode="wait">
                          {project.images && project.images.length > 0 && (
                            <motion.img
                              key={currentImageIndex[project.id] || 0}
                              src={project.images[currentImageIndex[project.id] || 0]?.image_url}
                              alt={project.title}
                              className="w-full h-full object-cover"
                              initial={{ opacity: 0, scale: 1.1 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.5 }}
                            />
                          )}
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-600 text-white">
                            {project.category?.name}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="text-gray-600 line-clamp-3">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {project.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(project.completion_date).getFullYear()}
                          </span>
                        </div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link href={`/projects/${project.slug}`}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                              Lihat Detail
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          <motion.div 
            className="text-center mt-12"
            initial={{ y: 30, opacity: 0 }}
            animate={isVisible['projects'] ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/projects">
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-semibold">
                  Lihat Semua Proyek
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact"
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        animate={isVisible['contact'] ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={isVisible['contact'] ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Siap untuk mewujudkan proyek konstruksi Anda? Hubungi kami hari ini untuk konsultasi gratis.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={isVisible['contact'] ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-600">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                      Informasi Kontak
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">
                        MARCHAND HYPE BINTARO LANTAI 1B29, JL. EMERALD BOULEVARD, PONDOK AREN, TANGERANG SELATAN
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">dayapranaraya@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Rino: 0813-1198-5588</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">Afani: 0877-7454-5867</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={isVisible['contact'] ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-600">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <Target className="w-8 h-8 mr-3 text-green-600" />
                      Jam Operasional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Senin - Jumat</span>
                      <span className="text-gray-900 font-semibold">08:00 - 17:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Sabtu</span>
                      <span className="text-gray-900 font-semibold">08:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Minggu & Hari Libur</span>
                      <span className="text-gray-900 font-semibold">Tutup</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
              initial={{ y: 30, opacity: 0 }}
              animate={isVisible['contact'] ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="https://wa.me/6281311985588?text=Halo%20PT.%20Daya%20Prana%20Raya,%20saya%20tertarik%20dengan%20layanan%20Anda" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Hubungi Sekarang
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="mailto:dayapranaraya@gmail.com">
                  <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-6 text-lg font-semibold shadow-lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Kirim Email
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-2">PT. Daya Prana Raya</h3>
              <motion.p 
                className="text-gray-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Civil Construction & Building Maintenance
              </motion.p>
            </motion.div>
            <Separator className="bg-gray-700 mb-6" />
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              © 2024 PT. Daya Prana Raya. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}