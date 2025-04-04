"use client"

import { Suspense, useEffect, useState } from "react"
import ChallengeGenerator from "./challenge-generator"
import ChallengesList from "./challenges-list"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/shared/header/Header"
import { Challenge, useGetChallengesofUserQuery, useGetChallengesQuery } from "@/states/apis/challengeApi"

export default function ChallengesPage() {
    const {data: challengesDataOfUser} = useGetChallengesofUserQuery();
    const {data: allChallengesExceptofCurrentUser} = useGetChallengesQuery();

    const [challengesCreatedByUser, setChallengesCreatedByUser] = useState<Challenge[]>([])
    const [challengesCreatedByOtherUsers, setChallengesCreatedByOtherUsers] = useState<Challenge[]>([])

    useEffect(()=>{
        if(challengesDataOfUser && challengesDataOfUser?.data?.length > 0){
            setChallengesCreatedByUser(challengesDataOfUser.data)
        }

        if(allChallengesExceptofCurrentUser && allChallengesExceptofCurrentUser?.data?.length > 0){
            setChallengesCreatedByOtherUsers(allChallengesExceptofCurrentUser?.data)
        }
    }, [challengesDataOfUser, allChallengesExceptofCurrentUser])

    return (
        <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 to-blue-900">
            <div className="p-4">
                <Header />
            </div>

            <div className="max-w-5xl mx-auto py-4 text-white">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Coding Challenges</h1>
                <p className="text-gray-300 mb-8">Generate custom coding challenges using AI or browse existing ones</p>

                <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
                    <ChallengeGenerator />
                </Suspense>

                <div className="mt-16">
                    <h2 className="text-2xl font-semibold mb-6">Your Challenges</h2>
                    {
                        challengesCreatedByUser?.length > 0 ? (
                            <Suspense fallback={<ChallengeSkeletons />}>
                                <ChallengesList challenges={challengesDataOfUser} />
                            </Suspense>
                        ) : (
                            <p className="text-center text-xl text-gray-300">No challenges found</p>
                        )
                    }
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-semibold mb-6">All Challenges</h2>
                    {
                        challengesCreatedByOtherUsers?.length != 0 ? (
                            <Suspense fallback={<ChallengeSkeletons />}>
                                <ChallengesList challenges={allChallengesExceptofCurrentUser} />
                            </Suspense>
                    ) : (
                            <p className="text-center text-xl text-gray-300">No challenges found</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

function ChallengeSkeletons() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
                .fill(0)
                .map((_, i) => (
                    <Skeleton key={i} className="h-[220px] rounded-lg" />
                ))}
        </div>
    )
}

