'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Code, FileText, Trophy, User } from "lucide-react"
import Header from "@/components/shared/header/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/redux";
import { formatDate } from "@/utils/profile";

interface StatsCardProps {
    title: string
    value: number
    icon: React.ReactNode
}

// Blogs created interfaces
interface BlogProps {
    id: string
    title: string
    createdAt: string
}

// Questions Submitted Interfaces
interface QuestionsSubmittedProps {
    id: string
    title: string
    difficulty: string
}

// Questions Created Interfaces
interface QuestionsCreatedProps {
    id: string
    title: string
    difficulty: string
    createdAt: string
}

interface ChallengesCreatedProps {
    id: string
    title: string
    topic: string
    difficulty: string
    created_at: string
}

// Challenges Taken Interfaces
interface ChallengesTakenProps {
    id: string
    title: string
    topic: string
    difficulty: string
    score: string
    createdAt: string
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("questions-submitted");

    const [questionsSubmitted, setQuestionsSubmitted] = useState<QuestionsSubmittedProps[]>([]);
    const [questionsCreated, setQuestionsCreated] = useState<QuestionsCreatedProps[]>([]);
    const [blogsCreated, setBlogsCreated] = useState<BlogProps[]>([]);
    const [challengesCreated, setChallengesCreated] = useState<ChallengesCreatedProps[]>([]);
    const [challengesTaken, setChallengesTaken] = useState<ChallengesTakenProps[]>([]);

    const user = useAppSelector(state => state.authSlice.user);

    useEffect(()=>{
        let url = ""
        switch(activeTab) {
            case "questions-submitted":
                url = "http://localhost:8000/api/v1/questions/submitted"
                break;
            case "questions-created":
                url = "http://localhost:8000/api/v1/questions/user"
                break;
            case "blogs-created":
                url = "http://localhost:8000/api/v1/blogs/user"
                break;
            case "challenges-created":
                url = "http://localhost:8000/api/v1/challenges/user"
                break;
            case "challenges-taken":
                url = "http://localhost:8000/api/v1/challenges/taken"
                break;
        }

        const fetchData = async () => {
            try {
                // skip network request if already fetched
                if(activeTab === "questions-submitted" && questionsSubmitted.length > 0) return
                if(activeTab === "questions-created" && questionsCreated.length > 0) return
                if(activeTab === "blogs-created" && blogsCreated.length > 0) return
                if(activeTab === "challenges-created" && challengesCreated.length > 0) return
                if(activeTab === "challenges-taken" && challengesTaken.length > 0) return

                const response = await axios.get(url, {withCredentials: true});

                if(!response.data) {
                    toast.error(response.data?.message)
                    return
                }

                if (activeTab === "questions-submitted") {
                    setQuestionsSubmitted(response.data.data as QuestionsSubmittedProps[])
                } else if (activeTab === "questions-created") {
                    setQuestionsCreated(response.data.data as QuestionsCreatedProps[])
                } else if (activeTab === "blogs-created") {
                    setBlogsCreated(response.data.data as BlogProps[])
                } else if(activeTab === "challenges-created") {
                    setChallengesCreated(response.data.data as ChallengesCreatedProps[])
                } else if (activeTab === "challenges-taken") {
                    setChallengesTaken(response.data.data as ChallengesTakenProps[])
                }
            } catch(error) {
                console.log(error)
            }
        }

        fetchData()
    }, [activeTab])

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="p-4">
                <Header />
            </div>
            
            <div className="grid gap-8 my-4">
                {/* Profile Header */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <Avatar className="w-24 h-24 border-4 border-background">
                        <AvatarFallback>
                            <User className="h-12 w-12" />
                            {user?.name}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{user?.name}</h1>
                            <p className="text-muted-foreground">{user?.username}</p>
                            <p className="text-muted-foreground">{user?.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <CalendarDays className="h-3 w-3" />
                                Joined on {formatDate(user?.created_at || "")}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <StatsCard title="Question Submissions" value={user?.stats?.questions_submitted || "N/A"} icon={<Code className="h-4 w-4" />} />
                    <StatsCard title="Questions Created" value={user?.stats?.questions_created || "N/A"} icon={<Code className="h-4 w-4" />} />
                    <StatsCard title="Blogs" value={user?.stats?.blogs_created || "N/A"} icon={<FileText className="h-4 w-4" />} />
                    <StatsCard title="Challenges Created" value={user?.stats?.challenges_created || "N/A"} icon={<Trophy className="h-4 w-4" />} />
                    <StatsCard title="Challenges Taken" value={user?.stats?.challenges_taken || "N/A"} icon={<Trophy className="h-4 w-4" />} />
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="questions-submitted" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                    <TabsList className="grid md:grid-cols-3 lg:grid-cols-5 w-full">
                        <TabsTrigger value="questions-submitted">Submissions</TabsTrigger>
                        <TabsTrigger value="questions-created">Questions Created</TabsTrigger>
                        <TabsTrigger value="blogs-created">Blogs</TabsTrigger>
                        <TabsTrigger value="challenges-created">Challenges Created</TabsTrigger>
                        <TabsTrigger value="challenges-taken">Challenges Taken</TabsTrigger>
                    </TabsList>

                    <TabsContent value="questions-submitted" className="mt-6">
                        <div className="grid gap-4">
                            {
                                questionsSubmitted?.length === 0 ? (
                                    <p className="text-muted-foreground text-center">
                                        You have not submitted any questions
                                    </p>
                                ) : (
                                    questionsSubmitted?.map((question) => (
                                        <QuestionsSubmittedCard key={question.id} id={question.id} title={question.title} difficulty={question.difficulty} />
                                    ))
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="questions-created" className="mt-6">
                        <div className="grid gap-4">
                            <Link href={"/problems/create"} className="w-full">
                                <Button className="w-full">
                                    Create A Question
                                </Button>
                            </Link>

                            {
                                questionsCreated?.length === 0 ? (
                                    <p className="text-muted-foreground text-center">
                                        You have not created any questions
                                    </p>
                                ) : (
                                    questionsCreated.map((question) => (
                                        <QuestionsCreatedCard key={question.id} id={question.id} title={question.title} createdAt={question.createdAt} difficulty={question.difficulty} />
                                    ))
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="blogs-created" className="mt-6">
                        <div className="grid gap-4">
                            {
                                blogsCreated?.length === 0 ? (
                                    <p className="text-muted-foreground text-center">
                                        You have not created any blogs
                                    </p>
                                ) : (
                                    blogsCreated.map((blog) => (
                                        <BlogCard key={blog.id} id={blog.id} title={blog.title} createdAt={blog.createdAt} />
                                    ))
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="challenges-created" className="mt-6">
                        <div className="grid gap-4">
                            {
                                challengesCreated?.length === 0 ? (
                                    <p className="text-muted-foreground text-center">
                                        You have not created any challenges
                                    </p>
                                ) : (
                                    challengesCreated.map((challenge) => (
                                        <ChallengeCreatedCard key={challenge.id} id={challenge.id} topic={challenge.topic} difficulty={challenge.difficulty} title={challenge.title} created_at={challenge.created_at} />
                                    ))
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="challenges-taken" className="mt-6">
                        <div className="grid gap-4">
                            {
                                challengesTaken?.length === 0 ? (
                                    <p className="text-muted-foreground text-center">
                                        You have not attempted any challenge
                                    </p>
                                ) : (
                                    challengesTaken.map((challenge) => (
                                        <ChallengeTakenCard key={challenge.id} id={challenge.id} title={challenge.title} topic={challenge.topic} difficulty={challenge.difficulty} score={challenge.score} createdAt={challenge.createdAt} />
                                    ))
                                )
                            }
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

function QuestionsSubmittedCard({id, title, difficulty}: QuestionsSubmittedProps) {
    const difficultyColor = {
        Easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    let difficultyCol = ""
    switch(difficulty) {
        case "Easy":
            difficultyCol = difficultyColor.Easy
            break;
        case "Medium":
            difficultyCol = difficultyColor.Medium
            break;
        case "Hard":
            difficultyCol = difficultyColor.Hard
            break;
        default:
            difficultyCol = difficultyColor.Easy
    }

    return (
        <Link href={`/problems/${title}?id=${id}`}>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{title}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyCol}`}>
                            {difficulty}
                        </span>
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
            break;
        case "Medium":
            difficultyCol = difficultyColor.Medium
            break;
        case "Hard":
            difficultyCol = difficultyColor.Hard
            break;
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
function ChallengeCreatedCard({id, title, topic, difficulty, created_at}: ChallengesCreatedProps) {
    const difficultyColor = {
        Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    let difficultyCol = ""
    switch(difficulty) {
        case "Beginner":
            difficultyCol = difficultyColor.Beginner
            break;
        case "Intermediate":
            difficultyCol = difficultyColor.Intermediate
            break;
        case "Advanced":
            difficultyCol = difficultyColor.Advanced
            break;
        default:
            difficultyCol = difficultyColor.Beginner
    }

    return (
        <Link href={`/challenges/${id}`}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <div className="flex justify-between items-start">
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                            {topic}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyCol}`}>
                            {difficulty}
                        </span>
                    </div>
                    <CardDescription>Created on {new Date(created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}

// Challenge Taken Card Component
function ChallengeTakenCard({id, title, topic, difficulty, score}: ChallengesTakenProps) {
    const difficultyColor = {
        Beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    }

    let difficultyCol = ""
    switch(difficulty) {
        case "Beginner":
            difficultyCol = difficultyColor.Beginner
            break;
        case "Intermediate":
            difficultyCol = difficultyColor.Intermediate
            break;
        case "Advanced":
            difficultyCol = difficultyColor.Advanced
            break;
        default:
            difficultyCol = difficultyColor.Beginner
    }

    return (
        <Link href={`/challenges/${id}/result`}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                            {topic}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyCol}`}>
                            {difficulty}
                        </span>
                    </div>
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
