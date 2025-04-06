import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export interface ChallengesTakenProps {
    id: string
    title: string
    topic: string
    difficulty: string
    score: string
    createdAt: string
}

export default function ChallengeTakenCard({id, title, topic, difficulty, score}: ChallengesTakenProps) {
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