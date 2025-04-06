import { useDeleteChallengeMutation } from "@/states/apis/challengeApi"
import { toast } from "sonner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import DeleteModal from "@/components/modals/delete-modal"
import { useAppDispatch } from "@/hooks/redux"
import { Stats, updateStats } from "@/states/slices/authSlice"

export interface ChallengesCreatedProps {
    id: string
    title: string
    topic: string
    difficulty: string
    created_at: string
}

export default function ChallengeCreatedCard({id, title, topic, difficulty, created_at}: ChallengesCreatedProps) {
    const [deleteChallenge, {isLoading}] = useDeleteChallengeMutation();

    const dispatch = useAppDispatch();
    
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
            if(payload?.data == true) {
                dispatch(updateStats({ challenges_created: -1, challenges_taken: -1 } as Stats));
                toast.message("Challenge deleted successfully!");
                window.location.reload();
            } else if(payload?.data == false) {
                dispatch(updateStats({ challenges_created: -1 } as Stats));
                toast.message("Challenge deleted successfully!");
                window.location.reload();
            } else {
                toast.message("Something went wrong");
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