import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Braces, Database, Code, Code2Icon } from "lucide-react"
import { ChallengeData } from "@/states/apis/challengeApi"

function getTopicIcon(topic: string) {
    switch (topic) {
        case "javascript":
            return <Braces className="h-4 w-4" />
        case "sql":
            return <Database className="h-4 w-4" />
        case "react":
            return <Code className="h-4 w-4" />
        case "python":
            return <Code2Icon className="h-4 w-4" />
        default:
            return <Code className="h-4 w-4" />
    }
}

function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
        case "Beginner":
            return "bg-green-100 text-green-800 hover:bg-green-200"
        case "Intermediate":
            return "bg-blue-100 text-blue-800 hover:bg-blue-200"
        case "Advanced":
            return "bg-orange-100 text-orange-800 hover:bg-orange-200"
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
}

export default function ChallengesList({challenges}: {challenges: ChallengeData | undefined}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges && challenges.data?.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                                {getTopicIcon(challenge.topic)}
                                <span className="capitalize">{challenge.topic}</span>
                            </div>
                            <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>{challenge.difficulty}</Badge>
                        </div>
                        <h3 className="font-semibold line-clamp-2">{challenge.title}</h3>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>{challenge.user_data.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{challenge.user_data.name}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

