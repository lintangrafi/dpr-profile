'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  ChevronRight,
  Building2
} from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang Kami', href: '/#about' },
    { name: 'Layanan', href: '/#services' },
    { name: 'Project', href: '/projects' },
    { name: 'Hubungi Kami', href: '/#contact' }
  ]

  const contactInfo = [
    { icon: Phone, text: '0813-1198-5588', href: 'https://wa.me/6281311985588?text=Halo%20PT.%20Daya%20Prana%20Raya,%20saya%20tertarik%20dengan%20layanan%20Anda' },
    { icon: Mail, text: 'dayapranaraya@gmail.com', href: 'mailto:dayapranaraya@gmail.com' }
  ]

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    // Smooth scroll for anchor links
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md border-b border-gray-200' 
            : 'bg-white shadow-sm border-b border-gray-100'
        }`}
      >
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative w-10 h-10 bg-blue-600 items-center justify-center overflow-hidden">
                  <img
                    src="/logo-company.png"
                    alt="PT. Daya Prana Raya"
                    className="w-full h-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-blue-900 truncate">
                    PT. Daya Prana Raya
                  </h1>
                  <p className="text-xs text-blue-600 truncate">
                    Civil Construction & Building Maintenance
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center flex-shrink-0">
              <Button 
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white whitespace-nowrap"
                asChild
              >
                <Link href="/admin">
                  Admin Login
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center flex-shrink-0">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-gray-700 hover:bg-gray-100 h-10 w-10"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 max-w-[85vw] p-0">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src="/logo-company.png"
                            alt="PT. Daya Prana Raya"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-gray-900 truncate">PT. Daya Prana Raya</h2>
                          <p className="text-sm text-gray-600 truncate">Civil Construction</p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4">
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className="flex items-center justify-between p-4 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                          >
                            <span className="font-medium">{item.name}</span>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </nav>

                    {/* Mobile Contact */}
                    <div className="p-4 border-t bg-gray-50">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Hubungi Kami</h3>
                      <div className="space-y-2 mb-4">
                        {contactInfo.map((contact, index) => (
                          <a
                            key={index}
                            href={contact.href}
                            target={contact.href.startsWith('https://') ? '_blank' : undefined}
                            rel={contact.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-white hover:bg-blue-50 transition-all duration-200"
                          >
                            <contact.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{contact.text}</span>
                          </a>
                        ))}
                      </div>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        asChild
                      >
                        <Link href="/admin">
                          Admin Login
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  )
}