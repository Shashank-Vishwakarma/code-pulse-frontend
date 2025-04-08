"use client"

import Header from '@/components/shared/header/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useGetChallengeByIdQuery, UserSelectedAnswer, useSubmitChallengeMutation } from '@/states/apis/challengeApi';
import { Stats, updateStats } from '@/states/slices/authSlice';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function ChallengePage() {
    const params = useParams();
    const {data: challenge} = useGetChallengeByIdQuery(params.slug as string)

    const [selectedAnswers, setSelectedAnswers] = useState<UserSelectedAnswer[]>([])

    const [submitChallenge, {isLoading}] = useSubmitChallengeMutation();

    const router = useRouter()

    const user = useAppSelector(state => state.authSlice.user);
    const dispatch = useAppDispatch();

    useEffect(()=>{
        if(!user) {
            router.push("/login");
            return
        }
    }, [user])

    const handleSubmit = async ()=>{
        if(Object.keys(selectedAnswers).length < 10){
            toast.error("Please answer all questions")
            return
        }

        try {
            const payload = await submitChallenge({id: params.slug as string, data: selectedAnswers}).unwrap();
            if(payload) {
                dispatch(updateStats({ challenges_taken: 1 } as Stats));

                toast.message("Challenge submitted successfully");
                router.push("/challenges")
            }
        } catch(err) {
            console.log("Error in submitting challenge: ", err)
            toast.error("Could not submit challenge")
        }
    }

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
                                value={selectedAnswers.find((answer) => answer.question == q.question)?.answer || ""}
                                onValueChange={(value) => {
                                    const filteredOptions = selectedAnswers.filter((answer) => answer.question != q.question)
                                    setSelectedAnswers([...filteredOptions, {question: q.question, answer: value}])
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
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Submit Challenge"
                        }
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
