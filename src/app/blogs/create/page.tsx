"use client"

import { Input } from '@/components/ui/input'
import React from 'react'
import MDEditor from '@uiw/react-md-editor';
import { useCreateBlogMutation } from '@/states/apis/blogApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/header/Header';
import { useAppDispatch } from '@/hooks/redux';
import {Stats, updateStats} from '@/states/slices/authSlice'

export default function CreateBlogPage() {
    const [title, setTitle] = React.useState('');
    const [image, setImage] = React.useState<File | null>(null);
    const [description, setDescription] = React.useState('');
    const [isBlogPublished, setIsBlogPublished] = React.useState(false);

    const [createBlog, {isLoading}] = useCreateBlogMutation();

    const router = useRouter();

    const dispatch = useAppDispatch();

    const handleCreateBlog = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('image', image as Blob);
            formData.append('body', description);
            formData.append('isBlogPublished', isBlogPublished.toString());

            const payload = await createBlog(formData).unwrap();
            if (payload) {
                dispatch(updateStats({ blogs_created: 1 } as Stats));

                toast.success(payload.message);
                router.replace("/blogs");
            } else {
                toast.error(payload)
            }
        } catch(error) {
            console.log("Error creating blog: ", error)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col px-4 py-12'>
            <div className='p-4'>
                <Header />
            </div>
            
            <h1 className='text-4xl font-bold text-green-500 text-center'>Create Blog Post</h1>
            <div className='flex flex-row gap-4 mt-4'>
                <Input
                    type="text"
                    className='w-1/2 px-4 py-2 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    placeholder='Enter Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                    type="file"
                    className='w-1/2 px-4 py-2 rounded-md bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    onChange={(e) => setImage(e.target.files && e.target.files[0])}
                />
            </div>
            <div className='mt-4'>
                <MDEditor
                    value={description}
                    onChange={(value) => setDescription(value || '')}
                    className='bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                    height={500}
                />
            </div>
            <div className="flex flex-row justify-centeritems-center space-x-2 mt-4">
                <Switch id="airplane-mode" checked={isBlogPublished} onCheckedChange={setIsBlogPublished} />
                <Label htmlFor="airplane-mode">Publish this blog</Label>
            </div>
            <Button
                className='mt-4 cursor-pointer bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900' 
                onClick={handleCreateBlog}
                disabled={isLoading}
            >
                {isLoading ? "Creating..." : "Create Blog"}
            </Button>
        </div>
    )
}
