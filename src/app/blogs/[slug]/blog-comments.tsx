import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppSelector } from '@/hooks/redux'
import { Comment, useCreateCommentMutation } from '@/states/apis/blogApi'
import { formatDistanceToNow } from 'date-fns'
import { Loader2, MessageSquare } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function BlogComments({id, comments}: {id: string, comments: Comment[]}) {
    const [newComment, setNewComment] = useState("");
    const [allComments, setAllComments] = useState<Comment[]>(comments)

    const [createComment, {isLoading}] = useCreateCommentMutation()

    const user = useAppSelector ((state) => state.authSlice.user)

    useEffect(()=>{
        setAllComments(comments)
    }, [comments])

    const onCreateComment = async () => {
        try {
            const payload = await createComment({id: id, body: newComment}).unwrap();
            if (payload) {
                const comment: Comment = {
                    id: payload,
                    body: newComment,
                    blogId: id,
                    userId: user?.id || "",
                    user: {
                        name: user?.name || "",
                        username: user?.username || ""
                    },
                    createdAt: new Date().toISOString(),
                }
                setAllComments([comment, ...allComments])
                setNewComment("")
                toast.message("Comment added successfully!")
            } else {
                toast.error("Could not create comment")
            }
        } catch (error) {
            console.log("Error creating comment: ", error)
        }
    }

    return (
        <div className="w-full md:w-80 lg:w-96 shrink-0 mt-8 md:mt-0">
            <div className="bg-muted rounded-lg p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">
                        Comments ({allComments.length})
                    </h2>
                </div>

                <div className='flex gap-2'>
                    <Input
                        placeholder='Write a comment...'
                        value={newComment}
                        onChange={(e)=> setNewComment(e.target.value)}
                    />
                    <Button
                        onClick={onCreateComment}
                        variant="outline"
                    >
                        {
                            isLoading ? <Loader2 className='animate-spin h-4 w-4'/> : "Add"
                        }
                    </Button>
                </div>

                <div className="space-y-4 w-full mt-3">
                    {
                        allComments?.length == 0 && (
                            <div className='text-center'>
                                No Comments
                            </div>
                        )
                    }
                    <ScrollArea className="h-72">
                        {allComments?.length > 0 && allComments.map((comment) => (
                            <div key={comment.id} className="bg-background rounded-md p-4 border mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {comment.user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{comment.user.name}</span>
                                        <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
                                    </div>

                                    <span className="ml-auto text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </span>
                                </div>

                                <p className="text-sm text-foreground leading-snug">
                                    {comment.body}
                                </p>
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
