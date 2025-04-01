"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCorrectAnswersForChallengeQuery } from "@/states/apis/challengeApi";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export function ChallengeResult() {
    const params = useParams();

    const {data: challenge} = useGetCorrectAnswersForChallengeQuery(params.slug as string);
    const router = useRouter();

    return (
        <div className="container max-w-4xl mx-auto py-10 px-4">
            <Card className="w-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Challenge Results</CardTitle>
                    <CardDescription>
                        You scored {challenge!.data?.score} {parseInt(challenge!.data?.score?.split("/")[0])} out of 10 questions correct)
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${parseInt(challenge!.data?.score?.split("/")[0])}%` }}
                            />
                        </div>
                        <div className="mt-8 space-y-4">
                            {challenge?.data.data?.map((q, index) => (
                                <div key={index} className="rounded-lg border p-4">
                                    <p className="font-medium">{q.question}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p>
                                            Your answer:{" "}
                                            <span
                                                className={
                                                    challenge.data.user_selected_answers[index].answer === q.correct_answer
                                                    ? "text-green-600 font-medium"
                                                    : "text-red-600 font-medium"
                                                }
                                            >
                                            {challenge.data.user_selected_answers[index].answer}
                                            </span>
                                        </p>
                                        {challenge.data.user_selected_answers[index].answer === q.correct_answer && (
                                            <p className="text-green-600 font-medium">Correct: {q.correct_answer}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
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