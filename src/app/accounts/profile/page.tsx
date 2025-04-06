'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
import QuestionsSubmitCard, { QuestionsSubmittedProps } from "../component-cards/questions-submitted-card";
import QuestionsCreatedCard, { QuestionsCreatedProps } from "../component-cards/questions-created-card";
import BlogCard, { BlogProps } from "../component-cards/blogs-created-card";
import ChallengeCreatedCard, { ChallengesCreatedProps } from "../component-cards/challenges-created-card";
import ChallengeTakenCard, { ChallengesTakenProps } from "../component-cards/challenges-taken-card";
import StatsCard from "../component-cards/stats-card";

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
                                        <QuestionsSubmitCard key={question.id} id={question.id} title={question.title} difficulty={question.difficulty} />
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
