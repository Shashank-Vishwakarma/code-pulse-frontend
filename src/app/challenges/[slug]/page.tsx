"use client"

import Header from '@/components/shared/header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetChallengeByIdQuery } from '@/states/apis/challengeApi';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

interface SelectedAnswer {
    question: string
    answer: string
}

export default function ChallengePage() {
    const params = useParams();
    const {data: challenge} = useGetChallengeByIdQuery(params.slug as string)

    const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswer[]>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [score, setScore] = useState(0)

    const router = useRouter()

    const handleSubmit = async ()=>{
        if(Object.keys(selectedAnswers).length < 10){
            toast.error("Please answer all questions")
            return
        }

        try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/challenges/${params.slug}/submit`, 
                { answers: selectedAnswers }, 
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            if(!response.data){
                toast.error(response.data?.message)
                return
            }

            setScore(parseInt(response.data?.score?.split("/")[0], 10))
            setIsSubmitted(true)
        } catch(err) {
            console.log("Error in submitting challenge: ", err)
            toast.error("Could not submit challenge")
        }
    }

    useEffect(()=>{
        if(!challenge){
            return
        }

        if (challenge.data.score !== "") {
            setScore(parseInt(challenge.data.score?.split("/")[0], 10))
            setIsSubmitted(true)
        }
    }, [challenge])

    if(isSubmitted) {
        return (
            <div className="container max-w-4xl mx-auto py-10 px-4">
                <div className="p-4">
                    <Header />
                </div>

                <Card className="w-full my-4">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Challenge Results</CardTitle>
                        <CardDescription className='font-medium text-xl my-2'>
                            Your score: {score.toFixed(0)} / 10
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col items-center justify-center py-10">
                        <Link href="/challenges">
                            <Button
                                className="w-full"
                                onClick={() => {
                                    router.push("/challenges");
                                }}
                            >
                                Go back to Challenges
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // if (isSubmitted) {
    //     return (
    //         <div className="container max-w-4xl mx-auto py-10 px-4">
    //             <Card className="w-full">
    //                 <CardHeader className="text-center">
    //                     <CardTitle className="text-3xl">Challenge Results</CardTitle>
    //                     <CardDescription>
    //                         You scored {score.toFixed(0)}% ({Math.round(score / 10)} out of 10 questions correct)
    //                     </CardDescription>
    //                 </CardHeader>
    //             <CardContent className="flex flex-col items-center justify-center py-10">
    //                 <div className="w-full max-w-md">
    //                     <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
    //                         <div
    //                             className="h-full bg-primary transition-all duration-500 ease-in-out"
    //                             style={{ width: `${score}%` }}
    //                         />
    //                     </div>
    //                     <div className="mt-8 space-y-4">
    //                         {challenge?.data.data?.map((q, index) => (
    //                         <div key={index} className="rounded-lg border p-4">
    //                             <p className="font-medium">{q.question}</p>
    //                             <div className="mt-2 flex items-center justify-between">
    //                                 <p>
    //                                     Your answer:{" "}
    //                                     <span
    //                                         className={
    //                                             selectedAnswers[index].answer === q.correctAnswer
    //                                             ? "text-green-600 font-medium"
    //                                             : "text-red-600 font-medium"
    //                                         }
    //                                     >
    //                                     {selectedAnswers[index].answer}
    //                                     </span>
    //                                 </p>
    //                                 {selectedAnswers[index].answer !== q.correctAnswer && (
    //                                     <p className="text-green-600 font-medium">Correct: {q.correctAnswer}</p>
    //                                 )}
    //                             </div>
    //                         </div>
    //                         ))}
    //                     </div>
    //                 </div>
    //             </CardContent>
    //             <CardFooter>
    //                 <Link href="/challenges">
    //                     <Button
    //                     className="w-full"
    //                     onClick={() => {
    //                         router.push("/challenges");
    //                     }}
    //                     >
    //                         Go back to Challenges
    //                     </Button>
    //                 </Link>
    //             </CardFooter>
    //             </Card>
    //         </div>
    //     )
    // }

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <div className="p-4">
                <Header />
            </div>

            <div className='my-2'>
                <Link href="/challenges">
                    <Button
                        className="w-full"
                        onClick={() => {
                            router.push("/challenges");
                        }}
                    >
                        Go back to Challenges
                    </Button>
                </Link>
            </div>

            <Card className="w-full my-4">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Challenge Quiz</CardTitle>
                    <CardDescription>Answer all 10 questions to complete the challenge</CardDescription>
                    <div className="mt-4">
                        <Progress value={challenge?.data?.data?.length==0 ? 0 : (Object.keys(selectedAnswers).length / 10) * 100} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                            {Object.keys(selectedAnswers).length} of {challenge?.data?.data.length} questions answered
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-8">
                    {challenge?.data.data?.map((q, index) => (
                        <div key={index} className="rounded-lg border p-4 transition-all hover:shadow-md">
                            <h3 className="text-lg font-medium mb-4">
                                Question {index+1}: {q.question}
                            </h3>
                            <RadioGroup
                                value={selectedAnswers[index]?.answer || ""}
                                onValueChange={(value) => {
                                    selectedAnswers[index] = { question: q.question, answer: value }
                                    setSelectedAnswers([...selectedAnswers])
                                }}
                                className="space-y-3"
                                >
                                {q.options.map((option) => (
                                    <div
                                        key={option}
                                        className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${
                                            selectedAnswers[index]?.answer === option ? "border-primary bg-primary/5" : ""
                                        }`}
                                        >
                                        <RadioGroupItem value={option} id={`${index}-${option}`} />
                                        <Label htmlFor={`${index}-${option}`} className="flex-grow cursor-pointer font-normal">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handleSubmit}>
                        Submit Challenge
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
