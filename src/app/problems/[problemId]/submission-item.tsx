import { Code } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {formatDistanceToNow} from "date-fns"
import { Editor } from "@monaco-editor/react"

interface SubmissionItemProps {
    id: string
    language: string
    code: string
    createdAt: string
}

export function SubmissionItem({ language, code, createdAt }: SubmissionItemProps) {
    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        <CardTitle className="text-base">
                            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </CardTitle>
                    </div>
                    <Badge variant="outline">{language}</Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Editor theme="vs-dark" options={{ readOnly: true }} className="h-[100px]" language={language.toLowerCase()} value={code} />
            </CardContent>
        </Card>
    )
}
