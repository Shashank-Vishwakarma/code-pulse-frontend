"use client"

import React, { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { CodeSnippet } from '@/states/apis/questionApi'
import axios from 'axios'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import {Stats, updateStats} from '@/states/slices/authSlice'
import { Loader2 } from 'lucide-react'

export default function CodeEditor({questionId, codeSnippets}: {questionId: string, codeSnippets: CodeSnippet[] | undefined}) {
    const user = useAppSelector(state => state.authSlice.user);
    
    const [language, setLanguage] = useState('python')
    const [code, setCode] = useState<string>("")
    const [output, setOutput] = useState(`No Output Available`);
    const editorRef = useRef(null)

    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(()=>{
        setCode(prev => localStorage.getItem(`${user?.username}-${questionId}-code-pulse-compiler-code-${language}`) || codeSnippets?.find((snippet) => snippet.language.toLowerCase() === language)?.code || "")
    }, [codeSnippets, language, setCode])

    const handleLanguageChange = (selectedLanguage: string) => {
        setLanguage(prev => selectedLanguage)
        setCode(prev => codeSnippets?.find((snippet) => snippet.language.toLowerCase() === language)?.code || "")
    }

    const handleEditorMount = (editor: any) => {
        editorRef.current = editor
    }

    const handleCodeChange = (value: string | undefined) => {
        setCode(value || "")
    }

    const handleExecute = async (type: string) => {
        if(type == "run") {
            setIsRunning(true)
            setOutput("Running your code...Please wait a moment")
        } else if(type == "submit") {
            setIsSubmitting(true)
            setOutput("Submitting your code...Please wait a moment")
        }

        try{
            const payload = {
                language: language,
                code: code,
                type: type,
            }

            const response = await axios.post(
                    `http://localhost:8000/api/v1/questions/${questionId}/execute/`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                )
            if (!response.data) {
                setOutput(response.data.message)
            } else {
                let out = ``
                for(let i = 0; i < response.data.data?.length; i++) {
                    const result = response.data.data[i]["result"] as boolean
                    if (result) {
                        out += `Testcase ${i+1}: Passed\n`
                    } else {
                        out += `Testcase ${i+1}: Failed\n`
                    }
                    if (type === "run") {
                        out += `Input: ${response.data.data[i]["input"]}\n`
                        out += `Output : ${response.data.data[i]["output"]}\n`
                        out += `Expected : ${response.data.data[i]["expected"]}\n`
                    }
                    out += `\n`
                }
                
                setOutput(out)

                // save the code to local storage
                localStorage.setItem(`${user?.username}-${questionId}-code-pulse-compiler-code-${language}`, code);

                // dispatch to store
                if(type == "submit") {
                    dispatch(updateStats({ questions_submitted: 1 } as Stats));
                }
            }
        } catch(err) {
            console.log("Error in executing code", err)
        } finally {
            setIsRunning(false)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Language and Action Buttons */}
            <div className="flex justify-between items-center p-2 bg-gray-800">
                <Select 
                    value={language} 
                    onValueChange={(value) => handleLanguageChange(value as string)}
                >
                    <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                </Select>

                <div className="space-x-2">
                    <Button 
                        variant="outline" 
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleExecute("run")}
                    >
                        {
                            isRunning ? <Loader2 className='w-4 h-4 animate-spin' /> : "Run"
                        }
                    </Button>
                    <Button 
                        variant="default" 
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => handleExecute("submit")}
                    >
                        {
                            isSubmitting ? <Loader2 className='w-4 h-4 animate-spin' /> : "Submit"
                        }
                    </Button>
                </div>
            </div>

            {/* Monaco Editor */}
            <Editor
                height="100%"
                theme="vs-dark"
                language={language === 'cpp' ? 'cpp' : language}
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                }}
            />

            <ScrollArea className="h-full w-full p-4">
                <pre className="text-white font-mono text-sm">
                    {output}
                </pre>
            </ScrollArea>
        </div>
    )
}
