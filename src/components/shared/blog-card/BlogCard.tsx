import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogData } from '@/states/apis/blogApi'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function BlogCard({data}: {data: BlogData | undefined}) {
    return (
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
    )
}
