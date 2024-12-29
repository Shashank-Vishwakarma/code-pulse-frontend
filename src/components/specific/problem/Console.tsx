"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'

export default function Console() {
    const [output, setOutput] = useState(`No Output Available`);
    const [customTestcase, setCustomTestcase] = useState({
        input: '',
    })

    const handlerTestCaseChange = (value: string) => {
        setCustomTestcase({
            ...customTestcase,
            input: value
        })
    }

    return (
        <div className="h-full flex flex-col bg-gray-900">
            <Tabs 
                defaultValue="testcases" 
                className="flex flex-col h-full"
            >
                <TabsList className="bg-gray-800 text-white">
                    <TabsTrigger value="testcases">Testcases</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                </TabsList>

                <TabsContent value="testcases" className="flex-1 overflow-hidden">
                    <ScrollArea className="h- w-full p-4">
                        <div className="p-3 rounded-lg">
                            <div className="text-sm text-gray-300">
                                <span className='text-blue-400 font-bold'>Enter Custom Input:</span>
                                <Input
                                    value={customTestcase.input}
                                    onChange={(e) => handlerTestCaseChange(e.target.value)}
                                    className='text-white mt-2'
                                />
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="output" className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full w-full p-4">
                        <pre className="text-white font-mono text-sm">
                            {output}
                        </pre>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
        </div>
    )
}
