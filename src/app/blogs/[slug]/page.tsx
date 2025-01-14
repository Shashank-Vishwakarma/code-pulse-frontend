"use client"

import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetBlogByIdQuery } from '@/states/apis/blogApi';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router';
import React from 'react'

export default function BlogPage() {
    const {slug} = useParams();
    const url = window.location.href;
    const q = url.split("?").pop();
    const id = q?.split("=").pop();
    
    const {data, error, isLoading} = useGetBlogByIdQuery(id as string);
    
    if (error) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-2xl font-bold text-red-500'>Blog not found</h1>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-2xl font-bold text-blue-500'>Loading...</h1>
            </div>
        )
    }

    if (data && data.data.slug !== slug) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <h1 className='text-2xl font-bold text-red-500'>Blog not found</h1>
            </div>
        )
    }

    console.log(data)

    return (
        <div className='h-screen flex flex-col justify-center gap-4 bg-gradient-to-br from-gray-200 to-gray-300'>
            <div className='px-10 py-4 flex-1'>
                <Image 
                    src={data?.data.imageUrl as string} 
                    alt={data?.data.title as string} 
                    width={1000} 
                    height={1000} 
                    className='w-full h-96 object-cover rounded-lg' 
                />
            </div>
            <div className='text-black flex-1 px-10'>
                <h1 className='bg-gray-300 text-2xl font-bold text-center p-4 rounded-lg'>{data?.data.title}</h1>
                <p className='mt-4'>{data?.data.body}</p>
            </div>
            <div className='px-10 py-4 w-full flex justify-center'>
                <Drawer>
                    <DrawerTrigger>
                        <span className='bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg'>Show Comments</span>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Comments</DrawerTitle>
                            <DrawerDescription>
                                {
                                    data && !data.data.comments && (
                                        <span className='text-center'>No comments yet</span>
                                    )
                                }
                                {
                                    data && data.data.comments && (
                                        <ScrollArea className='h-96'>
                                            {
                                                data && data.data.comments && data.data.comments.map((comment) => (
                                                    <div key={comment.id}>
                                                        <p>{comment.body}</p>
                                                    </div>
                                                ))
                                            }
                                        </ScrollArea>
                                    )
                                }
                            </DrawerDescription>
                        </DrawerHeader>
                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    )
}
