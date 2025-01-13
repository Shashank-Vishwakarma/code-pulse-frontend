"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetBlogsQuery } from '@/states/apis/blogApi'
import Image from 'next/image'
import { useDebounce } from '@/hooks/useDebounce'

export default function BlogsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const {data, error, isLoading} = useGetBlogsQuery(debouncedSearchQuery);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col px-4 py-12">
            <div className="text-center mb-12 h-1/4">
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">
                    CodePulse Blog
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Insights, tutorials, and thoughts on web development, technology, and innovation.
                </p>
            </div>

            <div className="w-full mx-auto mb-12 flex flex-row justify-center items-center">
                <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type='text' 
                    placeholder="Search blog posts" 
                    className="w-1/2 px-4 py-2 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"  
                />
                <Button className="m-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                    <Search className="h-5 w-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-3/4">
                {data?.data && data?.data.map((post) => (
                    <Link 
                        href={`/blogs/${post.slug}`} 
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
