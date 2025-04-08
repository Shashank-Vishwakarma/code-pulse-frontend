"use client"

import Header from '@/components/shared/header/Header'
import React, { useRef, useState, useEffect } from 'react'
import {FaPython} from "react-icons/fa"
import { RiJavascriptFill } from "react-icons/ri";
import { PiFileCppBold } from "react-icons/pi";
import { LiaJava } from "react-icons/lia";
import { FaGolang } from "react-icons/fa6";
import Editor from '@monaco-editor/react';
import { Loader2, Play, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';

const supportedLanguages = [
    {
        language: "python",
        icon: <FaPython className='w-8 h-8'/>,
        defaultCode: localStorage.getItem("python-code-pulse-compiler-code") || "print(\"Hello World\")"
    },
    {
        language: "javascript",
        icon: <RiJavascriptFill className='w-8 h-8'/>,
        defaultCode: localStorage.getItem("javascript-code-pulse-compiler-code") || "console.log(\"Hello World\")"
    },
    {
        language: "go",
        icon: <FaGolang className='w-8 h-8'/>,
        defaultCode: localStorage.getItem("go-code-pulse-compiler-code") || "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello World\")\n}"
    },
    {
        language: "cpp",
        icon: <PiFileCppBold  className='w-8 h-8'/>,
        defaultCode: localStorage.getItem("cpp-code-pulse-compiler-code") || "#include <bits/stdc++.h>\n\nusing namespace std;\n\nint main() {\n    cout << \"Hello World\";\n    return 0;\n}"
    },
    {
        language: "java",
        icon: <LiaJava  className='w-8 h-8'/>,
        defaultCode: localStorage.getItem("java-code-pulse-compiler-code") || "class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}"
    }
]

export default function OnlineCompiler() {
    const [selectedLanguage, setSelectedLanguage] = useState(supportedLanguages[0].language);
    const [code, setCode] = useState(supportedLanguages[0].defaultCode);
    const [consoleOutput, setConsoleOutput] = useState("");

    const [isRunning, setIsRunning] = useState(false);

    const editorRef = useRef(null);

    useEffect(()=>{
        setConsoleOutput("Run your code to see the output here...");
    }, [])

    const handleEditorMount = (editor: any) => {
        editorRef.current = editor;
    }

    const saveCodeToLocalStorage = (language: string, code: string) => {
        localStorage.setItem(`${language}-code-pulse-compiler-code`, code);
    }

    const clearCodeFromLocalStorage = (language: string) => {
        localStorage.removeItem(`${language}-code-pulse-compiler-code`);
    }

    const handleChangeLanguage = (language: string) => {
        setSelectedLanguage(language);
    }

    const handleClearConsole = () => {
        setConsoleOutput("")
    }

    const handleClearEditor = () => {
        setCode("");
        clearCodeFromLocalStorage(selectedLanguage);
    }

    const handleCodeRun = async () => {
        if(selectedLanguage === "" || code === "") {
            toast.error("Please select a language and write some code to run...");
            return
        }

        setIsRunning(true);
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/code",
                { language: selectedLanguage, code},
                { withCredentials: true }
            );

            if(!response.data) {
                toast.error(response.data?.message);
                return;
            }

            setConsoleOutput(response.data?.data);
        } catch(err) {
            console.log("Error running the code: ", err)
        } finally {
            setIsRunning(false);
        }

        saveCodeToLocalStorage(selectedLanguage, code);
    }

    return (
        <div className='h-screen bg-gradient-to-br from-gray-900 to-blue-900'>
            <div className='w-64'>
                <Header />
            </div>

            <div className="flex h-full bg-gray-100 pt-[73px]">
                {/* Language Selector Sidebar */}
                <div className=" bg-zinc-300 border-r border-gray-200 flex flex-col">
                    <div className="p-4 flex flex-col gap-4">
                        {supportedLanguages.map((language, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl shadow-sm bg-white hover:shadow-md cursor-pointer transition",
                                    selectedLanguage == language.language ? "bg-blue-600 text-white" : ""
                                )}
                                onClick={()=>{
                                    handleChangeLanguage(language.language);
                                    setCode(language.defaultCode);
                                }}
                            >
                                <div className="rounded-full">
                                    {language.icon}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor and Console Area */}
                <div className="flex-1 flex flex-col">
                    <ResizablePanelGroup direction='horizontal'>
                        <ResizablePanel defaultSize={55} className='className="h-full border-b border-gray-200"'>
                            {/* Code Editor */}
                            <Editor
                                height="100%"
                                theme="vs-dark"
                                language={selectedLanguage}
                                onChange={(value) => setCode(value || "")}
                                onMount={handleEditorMount}
                                value={code}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={45} className="h-full flex flex-col border-b border-r border-gray-200">
                            {/* Console Output */}
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
                                <h3 className="text-base font-medium text-gray-700">Console Output</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={handleClearConsole}>
                                        <Trash className="h-3 w-3" />
                                        Clear Console
                                    </Button>

                                    <Button variant="outline" onClick={handleClearEditor}>
                                        <Trash className="h-3 w-3" />
                                        Clear Editor
                                    </Button>

                                    <Button
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        onClick={handleCodeRun}
                                    >
                                        <Play className="h-4 w-4" />
                                        {isRunning ? "Running..." : "Run"}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 p-4 h-full font-mono text-sm bg-black text-white overflow-auto whitespace-pre-wrap">
                                {isRunning ? <Loader2 className='w-12 h-12 animate-spin mx-auto' /> : consoleOutput}
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    )
}

