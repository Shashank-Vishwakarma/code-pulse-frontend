"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Code, Database, Braces, Code2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCreateChallengeMutation } from "@/states/apis/challengeApi"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {updateStats, Stats} from '@/states/slices/authSlice'
import {useAppDispatch} from '@/hooks/redux'

const TOPICS = [
    { value: "javascript", label: "JavaScript", icon: <Braces className="h-4 w-4" /> },
    { value: "sql", label: "SQL", icon: <Database className="h-4 w-4" /> },
    { value: "react", label: "React", icon: <Code className="h-4 w-4" /> },
    { value: "python", label: "Python", icon: <Code2Icon className="h-4 w-4" /> },
]

const DIFFICULTY = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
]

export default function ChallengeGenerator() {
    const [title, setTitle] = useState("")
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState("")

    const router = useRouter()

    const [createBlog, {isLoading}] = useCreateChallengeMutation();

    const dispatch = useAppDispatch();

    const handleGenerate = async () => {
        if(title==="" || topic==="" || difficulty==="") {
            toast.error("Please fill all the fields")
            return
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('topic', topic);
            formData.append('difficulty', difficulty);

            const payload = await createBlog(formData).unwrap();
            if (payload) {
                dispatch(updateStats({ challenges_created: 1 } as Stats));

                toast.success(payload.message);
                router.refresh();
            }
        } catch(err) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Generate Challenge
                    </CardTitle>
                    <CardDescription>Select a topic and difficulty level to generate a custom challenge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="topic">Title</Label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Enter a title"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="topic">Programming Topic</Label>
                        <Select value={topic} onValueChange={setTopic}>
                            <SelectTrigger id="topic">
                                <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                                {TOPICS.map((topic) => (
                                    <SelectItem key={topic.value} value={topic.value}>
                                        <div className="flex items-center gap-2">
                                            {topic.icon}
                                            {topic.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label htmlFor="difficulty">Programming Topic</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Select a difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                {DIFFICULTY.map((difficulty) => (
                                    <SelectItem key={difficulty.value} value={difficulty.value}>
                                        <div className="flex items-center gap-2">
                                            {difficulty.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleGenerate} disabled={!topic || isLoading} className="w-full">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                            ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Challenge
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

