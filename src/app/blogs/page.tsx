"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useGetBlogsQuery } from '@/states/apis/blogApi'
import Image from 'next/image'
import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'

export default function BlogsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const {data, error, isLoading} = useGetBlogsQuery(debouncedSearchQuery);

    const router = useRouter();

    useEffect(() => {
        if (debouncedSearchQuery) {
            router.push("/blogs?q=" + debouncedSearchQuery);
        } else {
            router.push("/blogs");
        }
    }, [debouncedSearchQuery, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col px-4 py-12">
            <div className="text-center mb-4 h-1/4">
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
                    CodePulse Blog
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Insights, tutorials, and thoughts on web development, technology, and innovation.
                </p>
            </div>

            <div className='flex justify-center mb-4'>
                <Link href='/blogs/create' className='rounded-full px-4 py-2 bg-blue-500 text-white font-bold'>
                    Create Blog
                </Link>
            </div>

            {/* Used deboucing fot search and automatic fetch data using RTK Query */}
            <div className="w-full mx-auto mb-12 flex flex-row justify-center items-center">
                <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type='text' 
                    placeholder="Search blog posts" 
                    className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"  
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-3/4">
                {data?.data && data?.data.map((post) => (
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
                                        post && post.body?.length > 100
                                        ? `${post.body.substring(0, 100)}...`
                                        : post.body
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Image 
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className='w-full h-40 object-cover rounded-md'
                                    width={400}
                                    height={300}
                                />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {isLoading && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">
                        Loading blog posts...
                    </p>
                </div>
            )}

            {error && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">
                        An error occurred while fetching blog posts.
                    </p>
                </div>
            )}

            {data?.data && data?.data?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">
                        No blog posts available yet. Check back soon!
                    </p>
                </div>
            )}
        </div>
    )
}
