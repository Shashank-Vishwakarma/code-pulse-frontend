"use client"

import Header from '@/components/shared/header/Header'
import ProblemDescription, { Difficulty } from '@/components/specific/problem/ProblemDescription'
import CodeEditor from '@/components/specific/problem/CodeEditor'
import React, { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGetQuestionByIdQuery } from '@/states/apis/questionApi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'

export default function ProblemPage() {
    const params = useSearchParams()
    const {data: problemData, isLoading} = useGetQuestionByIdQuery(params?.get('id') as string);

    const router = useRouter();
    const user = useAppSelector(state => state.authSlice.user);
    useEffect(()=>{
        if(!user) {
            router.push("/login");
            return
        }
    }, [user])

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
            <div className="p-4 mb-8">
                <Header />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <ScrollArea className="w-2/5 overflow-y-auto border-r p-4">
                    <Tabs defaultValue='description'>
                        <TabsList className='grid grid-cols-2 w-full'>
                            <TabsTrigger value='description'>Description</TabsTrigger>
                            <TabsTrigger value='submissions'>Submissions</TabsTrigger>
                        </TabsList>

                        <TabsContent value='description'  className="w-full">
                            {
                                isLoading ? (
                                    <div className='w-full h-full flex items-center justify-center'>
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : (
                                    <ProblemDescription 
                                        title={problemData?.data?.title as string}
                                        difficulty={problemData?.data?.difficulty as Difficulty}
                                        topics={problemData?.data?.tags || []}
                                        description={problemData?.data?.description as string}
                                        examples={problemData?.data?.testCases || []}
                                        companies={problemData?.data?.companies || []}
                                        hints={problemData?.data?.hints || []}
                                    />
                                )
                            }
                        </TabsContent>

                        <TabsContent value='submissions'  className="mt-6">
                            <div className='text-center text-muted-foreground mt-6'>
                                No Submissions found
                            </div>
                        </TabsContent>
                    </Tabs>
                </ScrollArea>

                {/* Code Editor and Console - Right Panel */}
                <div className="w-3/5 flex flex-col">
                    <CodeEditor questionId={params?.get('id') as string} codeSnippets={problemData?.data.codeSnippets}/>
                </div>
            </div>
        </div>
    )
}
