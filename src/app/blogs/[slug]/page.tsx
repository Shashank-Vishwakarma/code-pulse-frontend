"use client"

import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Header from "@/components/shared/header/Header"
import BlogComments from "./blog-comments"
import { useEffect, useState } from "react"
import { Blog, useGetBlogByIdQuery } from "@/states/apis/blogApi"
import { useParams } from "next/navigation"
import Markdown from "react-markdown"

export default function BlogByIdPage() {
    const {slug} = useParams();
    const {data: blog} = useGetBlogByIdQuery(slug as string);

    const [blogData, setBlogData] = useState<Blog>()

    useEffect(() => {
        if(!blog) return

        setBlogData(blog?.data)
    }, [blog])

    return (
        <div className="min-h-screen bg-background">
            <div className="mb-12">
                <Header />
            </div>
            
            <div className="container mx-auto px-8 py-8">
                <div className="relative h-[400px] w-full overflow-hidden rounded-lg mb-8">
                    <Image 
                        src={blogData?.imageUrl || "/placeholder.svg"} 
                        alt={blogData?.title || "Blog Image"} 
                        fill 
                        className="object-cover" 
                        priority 
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogData?.title}</h1>

                        <div className="flex items-center gap-2 text-muted-foreground mb-6">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>
                                    {blogData?.author?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span>{blogData?.author?.name}</span>
                            <span>•</span>
                            <span>
                                {blogData?.createdAt && !isNaN(new Date(blogData.createdAt).getTime())
                                    ? formatDistanceToNow(new Date(blogData.createdAt), { addSuffix: true })
                                    : "Unknown"}
                            </span>
                        </div>

                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <Markdown>
                                {blogData?.body}
                            </Markdown>
                        </div>
                    </div>

                    {/* Comments Sidebar */}
                    <BlogComments comments={blogData?.comments || []} />
                </div>
            </div>
        </div>
    )
}
