import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface Challenge {
    id: string,
    title: string,
    topic: string,
    difficulty: string,
    user_id: string,
    user_data: {
        name: string,
        email: string
        username: string
    },
    data: {
        question: string,
        options: string[],
    },
    created_at: string
}

export interface ChallengeData {
    message: string
    data: Challenge[]
}

export interface SingleChallengeData {
    message: string
    data: Challenge
}

export const challengeApi = createApi({
    reducerPath: 'challengeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/challenges',
        credentials: 'include',
    }), 
    tagTypes: ['Challenges', 'Challenge', 'ChallengesByUser'],
    endpoints: (builder) => ({
        getChallenges: builder.query<ChallengeData, void>({
            query: () => "/all",
            providesTags: ['Challenges'],
        }),
        getChallengeById: builder.query<SingleChallengeData, string>({
            query: (id: string) => `/${id}`,
            providesTags: ['Challenge']
        }),
        getChallengeByUserId: builder.query<ChallengeData, string>({
            query: (userId: string) => `/user/${userId}`,
            providesTags: ['ChallengesByUser']
        }),
        createChallenge: builder.mutation({
            query: (data: FormData) => ({
                url: '/create',
                body: data,
                method: 'POST',
            }),
            invalidatesTags: ['Challenges', 'ChallengesByUser']
        }),
        deleteChallenge: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Challenges']
        })
    })
})

export const {useGetChallengesQuery, useGetChallengeByIdQuery, useGetChallengeByUserIdQuery, useCreateChallengeMutation, useDeleteChallengeMutation} = challengeApi
