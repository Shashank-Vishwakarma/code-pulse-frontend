"use client"

import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor';
import { useGetBlogByIdQuery, useUpdateBlogMutation } from '@/states/apis/blogApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/shared/header/Header';
import { useAppSelector } from '@/hooks/redux';

export default function EditBlogPage() {
    const {slug} = useParams();
    const {data: blog} = useGetBlogByIdQuery(slug as string);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isBlogPublished, setIsBlogPublished] = useState(false);

    const [updateBlog, {isLoading}] = useUpdateBlogMutation();

    const router = useRouter();

    const user = useAppSelector(state => state.authSlice.user);

    useEffect(()=>{
        if(!blog) return;

        setTitle(blog?.data?.title || "");
        setDescription(blog?.data?.body || "");
        setIsBlogPublished(blog?.data?.isBlogPublished || false);
    }, [blog])

    useEffect(()=>{
        if(!user) {
            router.push("/login");
            return
        }
    }, [user])

    const handleUpdateBlog = async () => {
        try {
            const data = {
                title,
                body: description,
                isBlogPublished
            }

            const payload = await updateBlog({id: slug as string, data}).unwrap();
            if (payload) {
                toast.success("Blog Updated successfully!");
                router.replace("/blogs");
            } else {
                toast.error(payload)
            }
        } catch(error) {
            console.log("Error updating the blog: ", error);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col px-4 py-12'>
            <div className='p-4'>
                <Header />
            </div>
            
            <h1 className='text-4xl font-bold text-green-500 text-center'>Update Blog</h1>
            <div className='flex flex-row gap-4 mt-4'>
                <Input
                    type="text"
                    className='w-full px-4 py-2 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    placeholder='Enter Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className='mt-4'>
                <MDEditor
                    value={description}
                    onChange={(value) => setDescription(value || "")}
                    className='bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    height={500}
                />
            </div>
            <div className="flex flex-row justify-centeritems-center space-x-2 mt-4">
                <Switch id="airplane-mode" checked={isBlogPublished} onCheckedChange={()=> setIsBlogPublished(!isBlogPublished)} />
                <Label htmlFor="airplane-mode">Publish this blog</Label>
            </div>
            <Button
                className='mt-4 cursor-pointer bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900' 
                onClick={handleUpdateBlog}
                disabled={isLoading}
            >
                {isLoading ? "Updating Blog..." : "Update Blog"}
            </Button>
        </div>
    )
}
