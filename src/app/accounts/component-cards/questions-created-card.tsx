import DeleteModal from "@/components/modals/delete-modal";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/redux";
import { useDeleteQuestionMutation } from "@/states/apis/questionApi";
import { Stats, updateStats } from "@/states/slices/authSlice";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export interface QuestionsCreatedProps {
    id: string
    title: string
    difficulty: string
    createdAt: string
}

export default function QuestionsCreatedCard({id, difficulty, title, createdAt}: QuestionsCreatedProps) {
    const [deleteQuestion, {isLoading}] = useDeleteQuestionMutation();

    const dispatch = useAppDispatch();

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
            if(payload?.data == true) {
                dispatch(updateStats({ questions_created: -1, questions_submitted: -1 } as Stats));
                toast.message("Question deleted successfully!");
                window.location.reload();
            } else if(payload?.data == false) {
                dispatch(updateStats({ questions_created: -1 } as Stats));
                toast.message("Question deleted successfully!");
                window.location.reload();
            } else {
                toast.message("Something went wrong");
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