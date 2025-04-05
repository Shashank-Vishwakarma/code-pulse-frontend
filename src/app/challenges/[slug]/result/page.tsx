"use client"

import Header from "@/components/shared/header/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux";
import { ChallengeWithCorrectAnswers, useGetCorrectAnswersForChallengeQuery, UserSelectedAnswer } from "@/states/apis/challengeApi";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChallengeResult() {
    const params = useParams();
    const {data: challenge} = useGetCorrectAnswersForChallengeQuery(params.slug as string);

    const user = useAppSelector(state => state.authSlice.user);

    const [challengeData, setChallengeData] = useState<ChallengeWithCorrectAnswers | null>(null);
    const [UserSelectedAnswers, setUserSelectedAnswers] = useState<UserSelectedAnswer[]>([]);

    const router = useRouter();

    useEffect(()=>{
        if(!challenge) return;

        setChallengeData(challenge.data);

        const userChallengeSubmissionData = challenge.data.user_submission_data.find((d) => d.submitted_by_user_id === user?.id);
        setUserSelectedAnswers(userChallengeSubmissionData?.user_selected_answers || []);
    }, [challenge])

    return (
        <div className="container mx-auto py-10 px-4 bg-gradient-to-br from-gray-900 to-blue-900">
            <div className="mb-12">
                <Header />
            </div>

            <Card className="w-3/4 mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">
                        {challengeData?.title}
                    </CardTitle>
                    <CardDescription>
                        <p className="text-center text-2xl">You scored {challengeData?.score}</p>
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full flex flex-col items-center">
                    <div className="w-full space-y-4">
                            {challengeData?.data?.map((q, index) => (
                                <div key={index} className="rounded-lg border-2 border-solid p-4 w-full">
                                    <p className="font-medium">{index+1}. {q.question}</p>
                                    <div className="mt-2 flex flex-col gap-2">
                                        <div
                                            className={
                                                UserSelectedAnswers?.find((ans)=>ans.question == q.question)?.answer == q.correct_answer
                                                ? "text-green-600 font-medium"
                                                : "text-red-600 font-medium"
                                            }
                                        >
                                            Your answer:{" "}{UserSelectedAnswers?.find((ans)=>ans.question == q.question)?.answer}
                                        </div>
                                        <div>
                                            {UserSelectedAnswers?.find((ans)=>ans.question == q.question)?.question == q.question && (
                                                <p className="font-medium text-zinc-500">Correct Answer: {q.correct_answer}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                </CardContent>
                <CardFooter>
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