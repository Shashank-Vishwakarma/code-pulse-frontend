'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/shared/header/Header';
import axios from 'axios';
import { Blog, BlogData } from '@/states/apis/blogApi';
import { Question, QuestionsData } from '@/states/apis/questionApi';
import Image from 'next/image';
import Link from 'next/link';

interface NavItem {
    title: string;
}

const navItems: NavItem[] = [
    { title: 'Questions'},
    { title: 'Blogs'},
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<string>('questions');
    const [data, setData] = useState<BlogData | QuestionsData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
        console.log("activeTab: ", activeTab)
        const fetchData = async () => {
            setData(null)
            setError(null)
            setIsLoading(true)
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/${activeTab}/user`, {
                    withCredentials: true,
                })
                if (!response.data) {
                    setError(response.data?.message)
                    setData(null)
                    return
                }
                if(activeTab === 'questions'){
                    setData(response.data as QuestionsData)
                }
                if(activeTab === 'blogs'){
                    setData(response.data as BlogData)
                }
                console.log(response.data)
                setError(null)
            } catch (error) {
                console.error('Error fetching data:', error);
                setData(null)
                setError('Something went wrong')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [activeTab])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-600 to-blue-900">
            <Header />
            <div className="container mx-auto px-4 py-24 h-full">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <div className="w-full h-full md:w-64 bg-white rounded-lg shadow-sm">
                        <nav className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Menu</h2>
                            <ul className="space-y-2">
                                {navItems.map((item) => (
                                    <li 
                                        key={item.title} 
                                        onClick={() => setActiveTab(item.title.toLowerCase())} 
                                        className={`block px-4 py-2 cursor-pointer rounded-md transition-colors ${activeTab === item.title.toLowerCase() ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {item.title}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
                        <div className="prose max-w-none">
                            {
                                error != null ? <p>{error}</p> : (
                                    <div>
                                        {isLoading && (
                                            <p className='px-6 py-4 whitespace-nowrap'>Loading...</p>
                                        )}

                                        {!isLoading && activeTab === 'questions' && data?.data.length !== undefined && data?.data.length > 0 && (data?.data as Question[]).map((item: Question) => (
                                            <Link href={`/problems/${item.slug}`} key={item.id} className='cursor-pointer flex-col'>
                                                <p className="px-6 py-4 whitespace-nowrap bg-green-100 rounded-lg cursor-pointer font-medium">{item.title}</p>
                                            </Link>
                                        ))}

                                        {!isLoading && activeTab === 'blogs' && data?.data.length !== undefined && data?.data.length > 0 && (data?.data as Blog[]).map((item: Blog) => (
                                            <Link href={`/blogs/${item.slug}`} key={item.id} className='cursor-pointer bg-green-100 flex flex-row items-center p-4'>
                                                <Image src={item.imageUrl} alt={item.title} width={200} height={200} className='object-cover' />
                                                <p className="px-6 py-4 whitespace-nowrap  rounded-lg cursor-pointer font-medium">{item.title}</p>
                                            </Link>
                                        ))}

                                        {!isLoading && !data && (
                                            <p className="px-6 py-4whitespace-nowrap">No data found</p>
                                        )}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
