import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface Example {
    input: string
    output: string
    explanation?: string
}

interface Question {
    title: string
    description: string
    difficulty: string
    examples: Example[]
}

export const questionApi = createApi({
    reducerPath: 'questionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000/api/v1/questions',
        credentials: 'include',
    }),
    tagTypes: ['Questions', 'Question'],
    endpoints: (builder) => ({
        getQuestions: builder.query<Question[], void>({
            query: () => '/',
            providesTags: ['Questions']
        }),
        getQuestionById: builder.query<Question, string>({
            query: (id) => `/${id}`,
            providesTags: ['Question']
        }),
        updateQuestion: builder.mutation({
            query: ({id, data}) => ({
                url: `/${id}`,
                body: data,
                method: 'PUT'
            }),
            invalidatesTags: ['Question']
        }),
        deleteQuestion: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Questions']
        })
    })
})

export const { useGetQuestionsQuery, useGetQuestionByIdQuery, useUpdateQuestionMutation, useDeleteQuestionMutation } = questionApi
