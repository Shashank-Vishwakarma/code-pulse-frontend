"use client"

import Header from '@/components/shared/header/Header'
import { 
    Code, 
    Database, 
    Layers, 
    Network, 
    Cpu, 
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface Problem {
    id: number
    title: string
    category: string[]
    difficulty: Difficulty
    acceptance: number
}

const problemCategories = [
    { name: 'Array', icon: <Layers className="mr-2" /> },
    { name: 'String', icon: <Code className="mr-2" /> },
    { name: 'Hash Table', icon: <Database className="mr-2" /> },
    { name: 'Dynamic Programming', icon: <Network className="mr-2" /> },
    { name: 'Math', icon: <Cpu className="mr-2" /> }
]

const problems: Problem[] = [
    {
        id: 1,
        title: 'Two Sum',
        category: ['Array'],
        difficulty: 'Easy',
        acceptance: 49.5,
    },
    {
        id: 2,
        title: 'Add Two Numbers',
        category: ['Linked List', 'Array'],
        difficulty: 'Medium',
        acceptance: 38.2,
    },
    {
        id: 3,
        title: 'Longest Substring Without Repeating Characters',
        category: ['String'],
        difficulty: 'Medium',
        acceptance: 33.7,
    },
    {
        id: 4,
        title: 'Median of Two Sorted Arrays',
        category: ['Array'],
        difficulty: 'Hard',
        acceptance: 35.6,
    },
    {
        id: 5,
        title: 'Two Sum',
        category: ['Array'],
        difficulty: 'Easy',
        acceptance: 49.5,
    },
    {
        id: 6,
        title: 'Add Two Numbers',
        category: ['Linked List', 'Array'],
        difficulty: 'Medium',
        acceptance: 38.2,
    },
    {
        id: 7,
        title: 'Longest Substring Without Repeating Characters',
        category: ['String'],
        difficulty: 'Medium',
        acceptance: 33.7,
    },
    {
        id: 8,
        title: 'Median of Two Sorted Arrays',
        category: ['Array'],
        difficulty: 'Hard',
        acceptance: 35.6,
    },
    {
        id: 9,
        title: 'Two Sum',
        category: ['Array'],
        difficulty: 'Easy',
        acceptance: 49.5,
    },
    {
        id: 10,
        title: 'Add Two Numbers',
        category: ['Linked List', 'Array'],
        difficulty: 'Medium',
        acceptance: 38.2,
    },
    {
        id: 11,
        title: 'Longest Substring Without Repeating Characters',
        category: ['String'],
        difficulty: 'Medium',
        acceptance: 33.7,
    },
    {
        id: 12,
        title: 'Median of Two Sorted Arrays',
        category: ['Array'],
        difficulty: 'Hard',
        acceptance: 35.6,
    }
]

export default function ProblemsPage() {
    const router = useRouter()

    const getDifficultyColor = (difficulty: Difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-500'
            case 'Medium': return 'text-yellow-500'
            case 'Hard': return 'text-red-500'
        }
    }

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
                                <th className="px-6 py-3 text-left">Acceptance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem) => (
                                <tr onClick={()=> router.push(`/problems/${problem.id}`)} key={problem.id} className="border-b border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">{problem.title}</td>
                                    <td className="px-6 py-4">
                                        {problem.category.map((category) => (
                                            <span key={category} className="mr-2 bg-white/10 px-2 py-1 rounded-full">
                                                {category}
                                            </span>
                                        ))}
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </td>
                                    <td className="px-6 py-4">{problem.acceptance}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
