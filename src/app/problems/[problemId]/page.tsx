"use client"

import Header from '@/components/shared/header/Header'
import ProblemDescription, { Difficulty } from '@/components/specific/problem/ProblemDescription'
import CodeEditor from '@/components/specific/problem/CodeEditor'
import Console from '@/components/specific/problem/Console'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSearchParams } from 'next/navigation'
import { useGetQuestionByIdQuery } from '@/states/apis/questionApi'

export default function ProblemPage() {
    // // Mock data - replace with actual data fetching logic
    // const problemData = {
    //     title: "Two Sum",
    //     difficulty: "Easy",
    //     topics: ["Array", "Hash Table"],
    //     description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    //     examples: [
    //         {
    //             input: "nums = [2,7,11,15], target = 9",
    //             output: "[0,1]",
    //             explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    //         },
    //         {
    //             input: "nums = [2,7,11,15], target = 9",
    //             output: "[0,1]",
    //             explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    //         }
    //     ],
    //     companies: ["Amazon", "Microsoft", "Google"],
    //     hints: [
    //         "Use a hash map to store complements",
    //         "Iterate through the array once"
    //     ]
    // }

    const params = useSearchParams()
    const {data: problemData, error, isLoading} = useGetQuestionByIdQuery(params?.get('id') as string);

    console.log(problemData)

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
            <div className="p-4 mb-8">
                <Header />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <ScrollArea className="w-2/5 overflow-y-auto border-r p-4">
                    <ProblemDescription 
                        title={problemData?.data?.title as string}
                        difficulty={problemData?.data?.difficulty as Difficulty}
                        topics={problemData?.data?.tags || []}
                        description={problemData?.data?.description as string}
                        examples={problemData?.data?.testCases || []}
                        companies={problemData?.data?.companies || []}
                        hints={problemData?.data?.hints || []}
                    />
                </ScrollArea>

                {/* Code Editor and Console - Right Panel */}
                <div className="w-3/5 flex flex-col">
                    <CodeEditor />
                    <Console />
                </div>
            </div>
        </div>
    )
}
