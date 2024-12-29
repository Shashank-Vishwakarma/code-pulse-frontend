"use client"

import React, { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'

// Predefined code templates for different languages
const codeTemplates = {
    python: `def twoSum(nums, target):
    # Write your solution here
    pass`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`
}

export default function CodeEditor() {
    const [language, setLanguage] = useState<keyof typeof codeTemplates>('python')
    const [code, setCode] = useState(codeTemplates.python)
    const editorRef = useRef(null)

    const handleLanguageChange = (selectedLanguage: keyof typeof codeTemplates) => {
        setLanguage(selectedLanguage)
        setCode(codeTemplates[selectedLanguage])
    }

    const handleEditorMount = (editor: any) => {
        editorRef.current = editor
    }

    const handleCodeChange = (value: string | undefined) => {
        setCode(value || '')
    }

    const handleRun = () => {
        // Implement code running logic
        console.log('Running code:', code)
    }

    const handleSubmit = () => {
        // Implement code submission logic
        console.log('Submitting code:', code)
    }

    return (
        <div className="flex flex-col h-full">
            {/* Language and Action Buttons */}
            <div className="flex justify-between items-center p-2 bg-gray-800">
                <Select 
                    value={language} 
                    onValueChange={(value) => handleLanguageChange(value as keyof typeof codeTemplates)}
                >
                    <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                </Select>

                <div className="space-x-2">
                    <Button 
                        variant="outline" 
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={handleRun}
                    >
                        Run
                    </Button>
                    <Button 
                        variant="default" 
                        className="bg-blue-600 text-white hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Submit
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
        </div>
    )
}
