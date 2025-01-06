import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface BlogPost {
    id: string
    title: string
    body: string
    createdAt: Date
}

const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Mastering React Performance',
        body: 'Deep dive into optimizing React applications for maximum efficiency.',
        createdAt: new Date(),
    },
    {
        id: '2',
        title: 'Next.js 14: What\'s New',
        body: 'Exploring the latest features and improvements in Next.js 14.',
        createdAt: new Date(),
    },
    {
        id: '3',
        title: 'State Management in Modern Web Apps',
        body: 'Comparing different state management solutions for scalable applications.',
        createdAt: new Date(),
    },
    {
        id: '4',
        title: 'Mastering React Performance',
        body: 'Deep dive into optimizing React applications for maximum efficiency.',
        createdAt: new Date(),
    },
    {
        id: '5',
        title: 'Next.js 14: What\'s New',
        body: 'Exploring the latest features and improvements in Next.js 14.',
        createdAt: new Date(),
    },
    {
        id: '6',
        title: 'State Management in Modern Web Apps',
        body: 'Comparing different state management solutions for scalable applications.',
        createdAt: new Date(),
    },
    {
        id: '7',
        title: 'Mastering React Performance',
        body: 'Deep dive into optimizing React applications for maximum efficiency.',
        createdAt: new Date(),
    },
    {
        id: '8',
        title: 'Next.js 14: What\'s New',
        body: 'Exploring the latest features and improvements in Next.js 14.',
        createdAt: new Date(),
    },
    {
        id: '9',
        title: 'State Management in Modern Web Apps',
        body: 'Comparing different state management solutions for scalable applications.',
        createdAt: new Date(),
    }
]

export default function BlogsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col px-4 py-12">
            <div className="text-center mb-12 h-1/4">
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
                    Code Pulse Blog
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Insights, tutorials, and thoughts on web development, technology, and innovation.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-3/4">
                {blogPosts.map((post) => (
                    <Link 
                        href={`/blogs/${post.id}`} 
                        key={post.id} 
                    >
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle className='flex justify-between'>
                                    <span className='text-xl'>
                                        {
                                            post.title
                                        }
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    {
                                        post.body.length > 50
                                        ? `${post.body.substring(0, 50)}...`
                                        : post.body
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                ff
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {blogPosts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">
                        No blog posts available yet. Check back soon!
                    </p>
                </div>
            )}
        </div>
    )
}
