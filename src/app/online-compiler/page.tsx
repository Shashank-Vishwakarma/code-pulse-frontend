"use client"

import Header from '@/components/shared/header/Header'
import React from 'react'
import {FaPython} from "react-icons/fa"
import { RiJavascriptFill } from "react-icons/ri";
import { PiFileCppBold } from "react-icons/pi";
import { LiaJava } from "react-icons/lia";
import { FaGolang } from "react-icons/fa6";
import Editor from '@monaco-editor/react';
import { Play, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"

const supportedLanguages = [
    {
        language: "python",
        icon: <FaPython className='w-4 h-4 mr-2'/>,
        defaultCode: "print(\"Hello World\")"
    },
    {
        language: "javaScript",
        icon: <RiJavascriptFill className='w-4 h-4 mr-2'/>,
        defaultCode: "console.log(\"Hello World\")"
    },
    {
        language: "cpp",
        icon: <PiFileCppBold  className='w-4 h-4 mr-2'/>,
        defaultCode: "#include <iostream>\nusing namespace std;\nint main() {\n    cout << \"Hello World\";\n    return 0;\n}"
    },
    {
        language: "java",
        icon: <LiaJava  className='w-4 h-4 mr-2'/>,
        defaultCode: "class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}"
    },
    {
        language: "go",
        icon: <FaGolang className='w-4 h-4 mr-2'/>,
        defaultCode: "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello World\")\n}"
    }
]

export default function OnlineCompiler() {
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
                                className="flex items-center gap-4 p-4 rounded-xl shadow-sm bg-white border hover:shadow-md cursor-pointer transition"
                            >
                                <div className="p-2 bg-gray-100 rounded-full">
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
                                language='python'
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
                                    <Button variant="outline">
                                        <Trash className="h-3 w-3" />
                                        Clear Console
                                    </Button>

                                    <Button variant="outline">
                                        <Trash className="h-3 w-3" />
                                        Clear Editor
                                    </Button>

                                    <Button
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <Play className="h-4 w-4" />
                                        Run
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 p-4 h-full font-mono text-sm bg-black text-green-400 overflow-auto whitespace-pre-wrap">
                                Run your code to see output here...
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    )
}

