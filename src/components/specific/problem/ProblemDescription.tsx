import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Example {
    input: string
    output: string
    explanation?: string
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface ProblemDescriptionProps {
    title: string
    difficulty: Difficulty
    topics: string[]
    description: string
    examples: Example[]
    companies: string[]
    hints: string[]
}

const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
}

export default function ProblemDescription({
    title,
    difficulty,
    topics,
    description,
    examples,
    companies,
    hints
}: ProblemDescriptionProps) {
    return (
        <div className="p-4 space-y-6 text-white">
            {/* Title and Difficulty */}
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">{title}</h1>
                <Badge 
                className={cn(
                    'px-3 py-1 rounded-full text-sm font-semibold', 
                    difficultyColors[difficulty]
                )}
                >
                {difficulty}
                </Badge>
            </div>

            {/* Topics */}
            <div>
                <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                    {topic}
                    </Badge>
                ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <p>{description}</p>
            </div>

            {/* Examples */}
            <div>
                {examples.map((example, index) => (
                <div key={index} className="bg-gray-600 p-4 rounded-lg mb-4">
                    <p className="font-medium mb-2">Example {index + 1}:</p>
                    <div>
                    <strong>Input:</strong> {example.input}
                    </div>
                    <div>
                    <strong>Output:</strong> {example.output}
                    </div>
                    {example.explanation && (
                    <div>
                        <strong>Explanation:</strong> {example.explanation}
                    </div>
                    )}
                </div>
                ))}
            </div>

            {/* Companies */}
            {companies.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Companies</h2>
                    <div className="flex flex-wrap gap-2">
                        {companies.map((company, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1 text-gray-200">
                            {company}
                        </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Hints */}
            {hints.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Hints</h2>
                    <ul className="list-disc list-inside space-y-2">
                        {hints.map((hint, index) => (
                        <li key={index} className="text-gray-200">{hint}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
