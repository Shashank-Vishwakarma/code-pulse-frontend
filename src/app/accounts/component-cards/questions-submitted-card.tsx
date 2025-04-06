import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export interface QuestionsSubmittedProps {
    id: string
    title: string
    difficulty: string
}

export default function QuestionsSubmittedCard({id, title, difficulty}: QuestionsSubmittedProps) {
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