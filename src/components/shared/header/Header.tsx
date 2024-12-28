"use client"

import Link from 'next/link'
import { Code, BookOpen, Newspaper } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { RootState } from '@/states/store'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { useEffect, useState } from 'react'
import { AlertDialogComponent } from '../alert-dialog/AlertDialog'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/states/slices/authSlice'

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

    const user = useAppSelector((state: RootState) => state.authSlice.user)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const path = usePathname()

    useEffect(()=>{
        if (!user) {
            if (path !== "/") {
                router.replace("/login")
            }
        }
    },[user])

    const [open, setOpen] = useState(false)

    const onOpenChange = () => {
        setOpen(prev => !prev)
    }

    const onContinue = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            )
            if (!response.data) {
                toast.error(response.data?.message)
                return
            }
            toast.success(response.data?.message)
            window.localStorage.removeItem("user")
            dispatch(setUser(null))
            router.replace("/login")
        } catch (error) {
            console.log("Error in logout", error)
            toast.error("Something went wrong")
        } finally {
            setOpen(false)
        }
    }

    return (
        <header className="bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 mb-4">
            <div className="container mx-auto flex justify-between items-center py-4 px-4">
                <Link href="/" className="flex items-center text-2xl font-bold text-white">
                    <Code className="mr-2 text-blue-500" />
                    CodePulse
                </Link>
                
                <nav className="flex space-x-6">
                    {user && navItems.map((item) => (
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
                    {
                        user ? (
                            <AlertDialogComponent 
                                open={open} onOpenChange={onOpenChange}
                                title='Logout'
                                description='Are you sure you want to logout?' 
                                onContinue={onContinue}
                            />
                        ) : (
                            <Link 
                                href="/login" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
                            >
                                Login
                            </Link>
                        )
                    }
                </div>
            </div>
        </header>
    )
}