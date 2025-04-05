'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Code, FileText, Pencil, Trash2, Trophy, User } from "lucide-react"
import Header from "@/components/shared/header/Header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/redux";
import { formatDate } from "@/utils/profile";
import DeleteModal from "@/components/modals/delete-modal";
import { useDeleteBlogMutation } from "@/states/apis/blogApi";
import { useDeleteQuestionMutation } from "@/states/apis/questionApi";
import { useDeleteChallengeMutation } from "@/states/apis/challengeApi";

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

type ActiveTab = "questions-submitted" | "questions-created" | "blogs-created" | "challenges-created" | "challenges-taken";

const tabUrlMapping: Record<ActiveTab, string> = {
    "questions-submitted": "http://localhost:8000/api/v1/questions/submitted",
    "questions-created": "http://localhost:8000/api/v1/questions/user",
    "blogs-created": "http://localhost:8000/api/v1/blogs/user",
    "challenges-created": "http://localhost:8000/api/v1/challenges/user",
    "challenges-taken": "http://localhost:8000/api/v1/challenges/taken"
}

export default function ProfilePage() {
    const [fetchedTabs, setFetchedTabs] = useState<Set<string>>(new Set());

    const [activeTab, setActiveTab] = useState("questions-submitted");

    const [questionsSubmitted, setQuestionsSubmitted] = useState<QuestionsSubmittedProps[]>([]);
    const [questionsCreated, setQuestionsCreated] = useState<QuestionsCreatedProps[]>([]);
    const [blogsCreated, setBlogsCreated] = useState<BlogProps[]>([]);
    const [challengesCreated, setChallengesCreated] = useState<ChallengesCreatedProps[]>([]);
    const [challengesTaken, setChallengesTaken] = useState<ChallengesTakenProps[]>([]);

    const user = useAppSelector(state => state.authSlice.user);

    useEffect(()=>{
        if(fetchedTabs.has(activeTab)) return

        const fetchData = async () => {
            const url = tabUrlMapping[activeTab as ActiveTab];

            try {
                const response = await axios.get(url, {withCredentials: true});

                if(!response.data) {
                    toast.error(response.data?.message)
                    return
                }

                fetchedTabs.add(activeTab);

                switch(activeTab) {
                    case "questions-submitted":
                        setQuestionsSubmitted(response.data.data as QuestionsSubmittedProps[])
                        break;
                    case "questions-created":
                        setQuestionsCreated(response.data.data as QuestionsCreatedProps[])
                        break;
                    case "blogs-created":
                        setBlogsCreated(response.data.data as BlogProps[])
                        break;
                    case "challenges-created":
                        setChallengesCreated(response.data.data as ChallengesCreatedProps[])
                        break;
                    case "challenges-taken":
                        setChallengesTaken(response.data.data as ChallengesTakenProps[])
                        break;
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
                    <StatsCard title="Question Submissions" value={user?.stats?.questions_submitted || "0"} icon={<Code className="h-4 w-4" />} />
                    <StatsCard title="Questions Created" value={user?.stats?.questions_created || "0"} icon={<Code className="h-4 w-4" />} />
                    <StatsCard title="Blogs" value={user?.stats?.blogs_created || "0"} icon={<FileText className="h-4 w-4" />} />
                    <StatsCard title="Challenges Created" value={user?.stats?.challenges_created || "0"} icon={<Trophy className="h-4 w-4" />} />
                    <StatsCard title="Challenges Taken" value={user?.stats?.challenges_taken || "0"} icon={<Trophy className="h-4 w-4" />} />
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
                                questionsSubmitted?.length > 0 ? (
                                    questionsSubmitted?.map((question) => (
                                        <QuestionsSubmittedCard key={question.id} id={question.id} title={question.title} difficulty={question.difficulty} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center">
                                        You have not submitted any questions
                                    </p>
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
                                questionsCreated?.length > 0 ? (
                                    questionsCreated?.map((question) => (
                                        <QuestionsCreatedCard key={question.id} id={question.id} title={question.title} createdAt={question.createdAt} difficulty={question.difficulty} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center">
                                        You have not created any questions
                                    </p>
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="blogs-created" className="mt-6">
                        <div className="grid gap-4">
                            {
                                blogsCreated?.length > 0 ? (
                                    blogsCreated?.map((blog) => (
                                        <BlogCard key={blog.id} id={blog.id} title={blog.title} createdAt={blog.createdAt} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center">
                                        You have not created any blogs
                                    </p>
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="challenges-created" className="mt-6">
                        <div className="grid gap-4">
                            {
                                challengesCreated?.length > 0 ? (
                                    challengesCreated?.map((challenge) => (
                                        <ChallengeCreatedCard key={challenge.id} id={challenge.id} topic={challenge.topic} difficulty={challenge.difficulty} title={challenge.title} created_at={challenge.created_at} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center">
                                        You have not created any challenges
                                    </p>
                                )
                            }
                        </div>
                    </TabsContent>

                    <TabsContent value="challenges-taken" className="mt-6">
                        <div className="grid gap-4">
                            {
                                challengesTaken?.length > 0 ? (
                                    challengesTaken?.map((challenge) => (
                                        <ChallengeTakenCard key={challenge.id} id={challenge.id} title={challenge.title} topic={challenge.topic} difficulty={challenge.difficulty} score={challenge.score} createdAt={challenge.createdAt} />
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center">
                                        You have not attempted any challenge
                                    </p>
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
    const [deleteQuestion, {isLoading}] = useDeleteQuestionMutation();

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

    const onQuestionDelete = async (id: string) => {
        try {
            const payload = await deleteQuestion(id).unwrap();
            if(payload) {
                toast.message("Question deleted successfully!");
                window.location.reload();
            }
        } catch(error) {
            console.log("Error deleting the question: ", error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <Link href={`/problems/${title}/?id=${id}`}>
                        <div className="flex gap-2">
                            <CardTitle className="text-lg">{title}</CardTitle>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyCol}`}>
                                {difficulty}
                            </span>
                        </div>
                    </Link>

                    <div className="flex gap-4 items-center">
                        <Link href={`/problems/${id}/edit`}>
                            <Pencil className="w-full h-full" />
                        </Link>
                        <DeleteModal 
                            title="Delete Problem" 
                            description="Are you sure you want to delete this problem?" 
                            isLoading={isLoading} 
                            onDelete={() => onQuestionDelete(id)}
                        >
                            <Trash2 className="w-full h-full" />
                        </DeleteModal>
                    </div>
                </div>
                <CardDescription>Created on {new Date(createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
        </Card>
    )
}

// Blog Card Component
function BlogCard({id, title, createdAt}: BlogProps) {
    const [deleteBlog, {isLoading}] = useDeleteBlogMutation()

    const onBlogDelete = async (id: string) => {
        try {
            const payload = await deleteBlog(id).unwrap();
            if(payload) {
                toast.message("Blog deleted successfully");
                window.location.reload();
            }
        } catch(error) {
            console.log("Error while deleting the blog", error)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Link href={`/blogs/${id}`}>
                        <CardTitle className="text-lg">{title}</CardTitle>
                    </Link>
                    <CardDescription>Published on {new Date(createdAt).toLocaleDateString()}</CardDescription>
                </div>

                <div className="flex gap-4 items-center">
                    <Link href={`/blogs/${id}/edit`}>
                        <Pencil className="w-full h-full" />
                    </Link>
                    <DeleteModal 
                        title="Delete Blog" 
                        description="Are you sure you want to delete this blog?" 
                        isLoading={isLoading} 
                        onDelete={() => onBlogDelete(id)}
                    >
                        <Trash2 className="w-full h-full" />
                    </DeleteModal>
                </div>
            </CardHeader>
        </Card>
    )
}

// Challenge Created Card Component
function ChallengeCreatedCard({id, title, topic, difficulty, created_at}: ChallengesCreatedProps) {
    const [deleteChallenge, {isLoading}] = useDeleteChallengeMutation()
    
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

    const onChallengeDelete = async (id: string) => {
        try {
            const payload = await deleteChallenge(id).unwrap();
            if(payload) {
                toast.message("Challenge deleted successfully!");
                window.location.reload();
            }
        } catch(error) {
            console.log("Error deleting the challenge: ", error)
        }
    }

    return (
        <Card>
            <CardHeader>
                <Link href={`/challenges/${id}`}>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </Link>
                <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                            {topic}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyCol}`}>
                            {difficulty}
                        </span>
                    </div>

                    <div className="flex gap-4 items-center">
                        <DeleteModal 
                            title="Delete Challenge" 
                            description="Are you sure you want to delete this challenge?" 
                            isLoading={isLoading} 
                            onDelete={() => onChallengeDelete(id)}
                        >
                            <Trash2 className="w-full h-full" />
                        </DeleteModal>
                    </div>
                </div>
                <CardDescription>Created on {new Date(created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
        </Card>
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
