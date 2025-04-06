import { useDeleteBlogMutation } from "@/states/apis/blogApi"
import { toast } from "sonner"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"
import DeleteModal from "@/components/modals/delete-modal"
import { useAppDispatch } from "@/hooks/redux"
import { Stats, updateStats } from "@/states/slices/authSlice"

export interface BlogProps {
    id: string
    title: string
    createdAt: string
}

export default function BlogCard({id, title, createdAt}: BlogProps) {
    const [deleteBlog, {isLoading}] = useDeleteBlogMutation()

    const dispatch = useAppDispatch();

    const onBlogDelete = async (id: string) => {
        try {
            const payload = await deleteBlog(id).unwrap();
            if(payload) {
                dispatch(updateStats({ blogs_created: -1 } as Stats));

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