"use client"

import Header from '@/components/shared/header/Header'
import { useAppSelector } from '@/hooks/redux'
import { useDebounce } from '@/hooks/useDebounce'
import { useGetQuestionsQuery } from '@/states/apis/questionApi'
import { RootState } from '@/states/store'
import { 
    Code, 
    Database, 
    Layers, 
    Network, 
    Cpu, 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const problemCategories = [
    { name: 'Array', icon: <Layers className="mr-2" /> },
    { name: 'String', icon: <Code className="mr-2" /> },
    { name: 'Hash Table', icon: <Database className="mr-2" /> },
    { name: 'Dynamic Programming', icon: <Network className="mr-2" /> },
    { name: 'Math', icon: <Cpu className="mr-2" /> }
]

export default function ProblemsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const searchQueryDebounced = useDebounce(searchQuery, 500);
    const { data, error, isLoading } = useGetQuestionsQuery(searchQueryDebounced)
    const router = useRouter()

    const user = useAppSelector((state: RootState) => state.authSlice.user)

    if(!user) {
        router.push("/login")
        return
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500'
            case 'Medium': return 'text-yellow-500'
            case 'Hard': return 'text-red-500'
        }
    }

    useEffect(() => {
        if (searchQueryDebounced) {
            router.push("/problems?q=" + searchQueryDebounced);
        } else {
            router.push("/problems");
        }
    }, [searchQueryDebounced, router]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
            <Header />
            <div className="container mx-auto px-4 py-24">
                <h1 className="text-3xl text-blue-300  font-bold flex justify-center mb-6">Problem Set</h1>
                <p className="text-center text-lg mx-auto mb-8">
                    Practice your coding skills by solving problems on a variety of topics. 
                    Click on a problem to view the details and submit your solution.
                </p>
                <div className="flex justify-center items-center mb-8">
                    <div className="flex space-x-4">
                        {problemCategories.map((category) => (
                            <button 
                                key={category.name} 
                                className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
                            >
                                {category.icon}
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/20">
                            <tr>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-6 py-3 text-left">Category</th>
                                <th className="px-6 py-3 text-left">Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data && data?.data?.length > 0 && !isLoading && data?.data?.map((problem) => (
                                <tr onClick={()=> router.push(`/problems/${problem.slug}?id=${problem.id}`)} key={problem.id} className="border-b border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">{problem.title}</td>
                                    <td className="px-6 py-4">
                                        {problem.tags.map((category) => (
                                            <span key={category} className="mr-2 bg-white/10 px-2 py-1 rounded-full">
                                                {category}
                                            </span>
                                        ))}
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {
                        !data?.data && !isLoading && (
                            <p className="text-white text-lg p-6 text-center">No problems found. Try creating a problem from your profile.</p>
                        )
                    }
                </div>
            </div>
        </main>
    )
}
