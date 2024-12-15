"use client"

import Link from 'next/link'
import { Code, User, BookOpen, Trophy, Newspaper } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
    const navItems = [
        { 
            href: '/problems', 
            icon: <Code className="mr-2" />, 
            label: 'Problems' 
        },
        { 
            href: '/learn', 
            icon: <BookOpen className="mr-2" />, 
            label: 'Learn' 
        },
        { 
            href: '/blogs', 
            icon: <Newspaper className="mr-2" />, 
            label: 'Blogs' 
        }
    ]

    const path = usePathname()

    return (
        <header className="bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 mb-4">
            <div className="container mx-auto flex justify-between items-center py-4 px-4">
                <Link href="/" className="flex items-center text-2xl font-bold text-white">
                    <Code className="mr-2 text-blue-500" />
                    CodePulse
                </Link>
                
                <nav className="flex space-x-6">
                    {navItems.map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href} 
                            className={`flex items-center text-gray-300 hover:text-white transition-colors ${
                                path === item.href ? 'text-white font-bold' : ''
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <Link 
                        href="/login" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </header>
    )
}