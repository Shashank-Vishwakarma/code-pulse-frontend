'use client';

// import React, { useEffect, useState } from 'react';
// import Header from '@/components/shared/header/Header';
// import axios from 'axios';
// import { Blog, BlogData } from '@/states/apis/blogApi';
// import { Question, QuestionsData } from '@/states/apis/questionApi';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Pen, Trash2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';

// interface NavItem {
//     title: string;
// }

// const navItems: NavItem[] = [
//     { title: 'Questions'},
//     { title: 'Blogs'},
// ];

// export default function ProfilePage() {
//     const [activeTab, setActiveTab] = useState<string>('questions');
//     const [data, setData] = useState<BlogData | QuestionsData | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const router = useRouter()

//     useEffect(()=>{
//         const fetchData = async () => {
//             setData(null)
//             setError(null)
//             setIsLoading(true)
//             try {
//                 const response = await axios.get(`http://localhost:8000/api/v1/${activeTab}/user`, {
//                     withCredentials: true,
//                 })
//                 if (!response.data) {
//                     setError(response.data?.message)
//                     setData(null)
//                     return
//                 }
//                 if(activeTab === 'questions'){
//                     setData(response.data as QuestionsData)
//                 }
//                 if(activeTab === 'blogs'){
//                     setData(response.data as BlogData)
//                 }
//                 setError(null)
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setData(null)
//                 setError('Something went wrong')
//             } finally {
//                 setIsLoading(false)
//             }
//         }

//         fetchData()
//     }, [activeTab])

//     const handleQuestionDelete = async (id: string) => {
//         try {
//             const response = await axios.delete(`http://localhost:8000/api/v1/questions/${id}`, {
//                 withCredentials: true,
//             })
//             if (!response.data) {
//                 return
//             }
//             toast.success(response.data?.message)
//         } catch (error) {
//             console.error('Error deleting data:', error);
//         }
//     }

//     const handleBlogDelete = async (id: string) => {
//         try {
//             const response = await axios.delete(`http://localhost:8000/api/v1/blogs/${id}`, {
//                 withCredentials: true,
//             })
//             if (!response.data) {
//                 return
//             }
//             toast.success(response.data?.message)
//         } catch (error) {
//             console.error('Error deleting data:', error);
//         }
//     }

//     const handleQuestionEdit = async (id: string) => {
//         try {
//             const response = await axios.put(`http://localhost:8000/api/v1/questions/${id}`, {
//                 withCredentials: true,
//             })
//             if (!response.data) {
//                 return
//             }
//         } catch (error) {
//             console.error('Error deleting data:', error);
//         }
//     }

//     const handleBlogEdit = async (id: string) => {
//         try {
//             const response = await axios.put(`http://localhost:8000/api/v1/blogs/${id}`, {
//                 withCredentials: true,
//             })
//             if (!response.data) {
//                 return
//             }
//         } catch (error) {
//             console.error('Error deleting data:', error);
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-600 to-blue-900">
//             <Header />
//             <div className="container mx-auto px-4 py-24 h-full">
//                 <div className="flex flex-col md:flex-row gap-6">
//                     {/* Sidebar */}
//                     <div className="w-full h-full md:w-64 bg-white rounded-lg shadow-sm">
//                         <nav className="p-4">
//                             <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Menu</h2>
//                             <ul className="space-y-2">
//                                 {navItems.map((item) => (
//                                     <li 
//                                         key={item.title} 
//                                         onClick={() => setActiveTab(item.title.toLowerCase())} 
//                                         className={`block px-4 py-2 cursor-pointer rounded-md transition-colors ${activeTab === item.title.toLowerCase() ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
//                                     >
//                                         {item.title}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </nav>
//                     </div>

//                     {/* Main Content */}
//                     <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
//                         <div className="prose max-w-none">
//                             {
//                                 error != null ? <p>{error}</p> : (
//                                     <div>
//                                         {isLoading && (
//                                             <p className='px-6 py-4 whitespace-nowrap'>Loading...</p>
//                                         )}

//                                         {/* Questions submitted */}
//                                         {!isLoading && activeTab === 'questions' && data?.data?.length !== undefined && data?.data?.length > 0 && (data?.data as Question[]).map((item: Question) => (
//                                             <div className=''>
//                                                 <Button className='p-2 mb-4' onClick={()=> router.push(`/problems/create`)}>
//                                                     Submit a Question
//                                                 </Button>
//                                                 <div key={item.id} className='bg-green-100 rounded-lg font-medium py-4 px-2 flex flex-row items-center justify-between'>
//                                                     <Link href={`/problems/${item.slug}`}>
//                                                         <p className="cursor-pointer">{item.title}</p>
//                                                     </Link>
//                                                     <div className='flex flex-row items-center gap-2'>
//                                                         <Pen className='cursor-pointer' onClick={() => handleQuestionEdit(item.id)} />
//                                                         <Trash2 className='cursor-pointer' onClick={() => handleQuestionDelete(item.id)}/>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                         {/* Blogs published */}
//                                         {!isLoading && activeTab === 'blogs' && data?.data?.length !== undefined && data?.data?.length > 0 && (data?.data as Blog[]).map((item: Blog) => (
//                                             <div key={item.id} className='bg-green-100 rounded-lg font-medium py-4 px-2 flex flex-row items-center justify-between'>
//                                                 <Link href={`/blogs/${item.slug}`} className='cursor-pointer flex flex-row items-center gap-2'>
//                                                     <Image src={item.imageUrl} alt={item.title} width={200} height={200} className='object-cover' />
//                                                     <p className="px-6 py-4 whitespace-nowrap  rounded-lg cursor-pointer font-medium">{item.title}</p>
//                                                 </Link>
//                                                 <div className='flex flex-row items-center gap-2'>
//                                                     <Pen className='cursor-pointer' onClick={() => handleBlogEdit(item.id)} />
//                                                     <Trash2 className='cursor-pointer' onClick={() => handleBlogDelete(item.id)}/>
//                                                 </div>
//                                             </div>
//                                         ))}

//                                         {/* Challenges Taken */}

//                                         {!isLoading && !data && (
//                                             <p className="px-6 py-4whitespace-nowrap">No data found</p>
//                                         )}
//                                     </div>
//                                 )
//                             }
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// import type { Metadata } from "next"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CalendarDays, Code, FileText, Trophy, User } from "lucide-react"
import { SingleBlog } from "@/states/apis/blogApi"
import { SingleQuestion } from "@/states/apis/questionApi"
import { SingleChallengeData } from "@/states/apis/challengeApi"
import { useAppSelector } from "@/hooks/redux";
import Header from "@/components/shared/header/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// export const metadata: Metadata = {
//     title: "Profile",
//     description: "User profile page",
// }

interface StatsCardProps {
    title: string
    value: number
    icon: React.ReactNode
}

interface BlogProps {
    title: string
    createdAt: string
}

interface QuestionsSubmittedProps {
    id: string
    title: string
}

interface QuestionsCreatedProps {
    id: string
    title: string
    difficulty: string
    createdAt: string
}

interface ChallengesCreatedProps {
    title: string
    createdAt: string
}

interface ChallengesTakenProps {
    id: string
    title: string
    score: string
    createdAt: string
}

// Mock data - replace with actual data fetching
const mockUser = {
    id: "1",
    name: "Jane Cooper",
    username: "jane23",
    email: "jane.cooper@example.com",
    image: "/placeholder.svg?height=100&width=100",
    joinedDate: "January 2023",
    role: "Developer",
    stats: {
        blogs: 12,
        questions: 24,
        challengesCreated: 5,
        challengesTaken: 18,
    },
}

const mockBlogs = [
    { id: "1", title: "Understanding Big O Notation", date: "2023-10-15", likes: 42, comments: 8 },
    { id: "2", title: "Mastering React Hooks", date: "2023-09-22", likes: 37, comments: 12 },
    { id: "3", title: "Efficient Algorithms for Sorting", date: "2023-08-10", likes: 29, comments: 5 },
]

const mockQuestions = [
    { id: "1", title: "Two Sum Problem", difficulty: "Easy", date: "2023-10-10", solved: 156 },
    { id: "2", title: "Merge K Sorted Lists", difficulty: "Hard", date: "2023-09-05", solved: 78 },
    { id: "3", title: "Valid Parentheses", difficulty: "Medium", date: "2023-08-20", solved: 210 },
]

const mockChallengesCreated = [
    { id: "1", title: "30 Days of JavaScript", participants: 245, date: "2023-10-01" },
    { id: "2", title: "Database Design Challenge", participants: 112, date: "2023-08-15" },
]

const mockChallengesTaken = [
    { id: "1", title: "Algorithms Bootcamp", completion: 100, date: "2023-09-30", score: "3/10" },
    { id: "2", title: "Frontend Masters", completion: 75, date: "2023-10-15" , score: "4/10"},
    { id: "3", title: "System Design Interview Prep", completion: 50, date: "2023-10-20" , score: "8/10"},
]

export default function ProfilePage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="p-4">
                <Header />
            </div>
            
            <div className="grid gap-8 my-4">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarImage src={mockUser.image} alt={mockUser.name} />
                        <AvatarFallback>
                            <User className="h-12 w-12" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                            <p className="text-muted-foreground">{mockUser.username}</p>
                            <p className="text-muted-foreground">{mockUser.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                Joined {mockUser.joinedDate}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatsCard title="Question Submissions" value={mockUser.stats.questions} icon={<Code className="h-4 w-4" />} />
                    <StatsCard title="Questions Created" value={mockUser.stats.questions} icon={<Code className="h-4 w-4" />} />
                    <StatsCard title="Blogs" value={mockUser.stats.blogs} icon={<FileText className="h-4 w-4" />} />
                    <StatsCard title="Challenges Created" value={mockUser.stats.challengesCreated} icon={<Trophy className="h-4 w-4" />} />
                    <StatsCard title="Challenges Taken" value={mockUser.stats.challengesTaken} icon={<Trophy className="h-4 w-4" />} />
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="questions-submitted" className="w-full">
                    <TabsList className="grid md:grid-cols-3 lg:grid-cols-5 w-full">
                        <TabsTrigger value="questions-submitted">Submissions</TabsTrigger>
                        <TabsTrigger value="questions">Questions Created</TabsTrigger>
                        <TabsTrigger value="blogs">Blogs</TabsTrigger>
                        <TabsTrigger value="challenges-created">Challenges Created</TabsTrigger>
                        <TabsTrigger value="challenges-taken">Challenges Taken</TabsTrigger>
                    </TabsList>

                    <TabsContent value="questions-submitted" className="mt-6">
                        <div className="grid gap-4">
                            {mockQuestions.map((question) => (
                                <QuestionsSubmittedCard key={question.id} id={question.id} title={question.title} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="questions" className="mt-6">
                        <div className="grid gap-4">
                            <Link href={"/problems/create"} className="w-full">
                                <Button className="w-full">
                                    Create A Question
                                </Button>
                            </Link>

                            {mockQuestions.map((question) => (
                                <QuestionsCreatedCard key={question.id} id={question.id} title={question.title} createdAt={question.date} difficulty={question.difficulty} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="blogs" className="mt-6">
                        <div className="grid gap-4">
                            {mockBlogs.map((blog) => (
                                <BlogCard key={blog.id} title={blog.title} createdAt={blog.date} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="challenges-created" className="mt-6">
                        <div className="grid gap-4">
                            {mockChallengesCreated.map((challenge) => (
                                <ChallengeCreatedCard key={challenge.id} title={challenge.title} createdAt={challenge.date} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="challenges-taken" className="mt-6">
                        <div className="grid gap-4">
                            {mockChallengesTaken.map((challenge) => (
                                <ChallengeTakenCard key={challenge.id} id={challenge.id} title={challenge.title} score={challenge.score} createdAt={challenge.date} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

// Stats Card Component
function StatsCard({ title, value, icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

function QuestionsSubmittedCard({id, title}: QuestionsSubmittedProps) {
    return (
        <Link href={`/problems/${title}?id=${id}`}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    )
}

// Question Card Component
function QuestionsCreatedCard({id, difficulty, title, createdAt}: QuestionsCreatedProps) {
    const difficultyColor = {
        Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    let difficultyCol = ""
    switch(difficulty) {
        case "Easy":
            difficultyCol = difficultyColor.Easy
        case "Medium":
            difficultyCol = difficultyColor.Medium
        case "Hard":
            difficultyCol = difficultyColor.Hard
        default:
            difficultyCol = difficultyColor.Easy
    }

    return (
        <Link href={`/problems/${id}/edit`}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyCol}`}>
                            {difficulty}
                        </span>
                    </div>
                    <CardDescription>Created on {new Date(createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

// Blog Card Component
function BlogCard({title, createdAt}: BlogProps) {
    return (
        <Link href={`/blogs/${title}`}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>Published on {new Date(createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

// Challenge Created Card Component
function ChallengeCreatedCard({title, createdAt}: ChallengesCreatedProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>Created on {new Date(createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
        </Card>
    )
}

// Challenge Taken Card Component
function ChallengeTakenCard({id, title, score}: ChallengesTakenProps) {
    return (
        <Link href={`/challenges/${id}/result`}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">score: {score}</div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
