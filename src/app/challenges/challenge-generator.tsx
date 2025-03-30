"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Code, Database, Braces, Code2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCreateChallengeMutation } from "@/states/apis/challengeApi"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const TOPICS = [
    { value: "javascript", label: "JavaScript", icon: <Braces className="h-4 w-4" /> },
    { value: "sql", label: "SQL", icon: <Database className="h-4 w-4" /> },
    { value: "react", label: "React", icon: <Code className="h-4 w-4" /> },
    { value: "python", label: "Python", icon: <Code2Icon className="h-4 w-4" /> },
]

const DIFFICULTY_LABELS = ["Beginner", "Intermediate", "Advanced"]

export default function ChallengeGenerator() {
    const [title, setTitle] = useState("")
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState([1])

    const router = useRouter()

    const [createBlog, {isLoading}] = useCreateChallengeMutation();

    const handleGenerate = async () => {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('topic', topic);
            formData.append('difficulty', DIFFICULTY_LABELS[difficulty[0]]);

            const payload = await createBlog(formData).unwrap();
            if (payload) {
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
                    <CardDescription>Select a topic and difficulty level to generate a custom coding challenge</CardDescription>
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
                        <div className="flex justify-between">
                            <Label>Difficulty Level</Label>
                            <Badge variant="outline">{DIFFICULTY_LABELS[difficulty[0] - 1]}</Badge>
                        </div>
                        <Slider value={difficulty} onValueChange={setDifficulty} max={3} min={1} step={1} className="py-2" />
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

