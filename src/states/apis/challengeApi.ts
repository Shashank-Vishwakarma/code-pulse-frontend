import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

interface Userdata {
    name: string,
    email: string
    username: string
}

interface UserSelectedAnswer {
    question: string,
    answer: string
}

interface QuestionData {
    question: string,
    options: string[],
}

interface QuestionDataWithCorrectAnswers {
    question: string,
    options: string[],
    correct_answer: string
}

interface Challenge {
    id: string,
    title: string,
    topic: string,
    difficulty: string,
    user_id: string,
    user_data: Userdata,
    data: QuestionData[],
    score: string,
    user_selected_answers: UserSelectedAnswer[],
    created_at: string
}

interface ChallengeWithCorrectAnswers {
    id: string,
    title: string,
    topic: string,
    difficulty: string,
    user_id: string,
    user_data: Userdata,
    data: QuestionDataWithCorrectAnswers[],
    score: string,
    user_selected_answers: UserSelectedAnswer[],
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

export interface SingleChallengeDataWithCorrectAnswers {
    message: string
    data: ChallengeWithCorrectAnswers
}

export const challengeApi = createApi({
    reducerPath: 'challengeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/challenges',
        credentials: 'include',
    }), 
    tagTypes: ['Challenges', 'Challenge', 'ChallengesByUser', 'CorrectAnswers'],
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
        getCorrectAnswersForChallenge: builder.query<SingleChallengeDataWithCorrectAnswers, string>({
            query: (id: string) => `/${id}/answers`,
            providesTags: ['CorrectAnswers']
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

export const {useGetChallengesQuery, useGetChallengeByIdQuery, useGetChallengeByUserIdQuery, useGetCorrectAnswersForChallengeQuery, useCreateChallengeMutation, useDeleteChallengeMutation} = challengeApi
