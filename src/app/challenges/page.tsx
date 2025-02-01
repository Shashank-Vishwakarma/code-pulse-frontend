import Header from '@/components/shared/header/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'

export default function ChallengesPage() {
    const quizzes = [
        {
            name: 'SQL',
            description: 'Test your SQL skills with our interactive quiz',
            href: 'sql',
        },
        {
            name: 'Redis',
            description: 'Test your Redis skills with our interactive quiz',
            href: 'redis',
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col px-4 py-12">
            <div className="p-4">
                <Header />
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                    Practice Quizzes to Improve Your Coding Skills
                </p>
            </div>

            <div className="flex flex-wrap justify-center">
                {quizzes.map(quiz => (
                    <Link key={quiz.name} href={`challenges/${quiz.href}`} className="w-full md:w-1/2 xl:w-1/3 p-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{quiz.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{quiz.description}</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}