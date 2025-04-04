import React from "react"

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogTitle,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction
} from "../ui/alert-dialog"
import { Loader2 } from "lucide-react"

export default function DeleteModal({title, description, isLoading, children, onDelete}: {title: string, description: string, isLoading: boolean, children: React.ReactNode, onDelete: () => void}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>
                    {title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                        {
                            isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Continue"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
