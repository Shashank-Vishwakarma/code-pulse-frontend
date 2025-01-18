import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface TestCase {
    input: string
    output: string
    explanation?: string
}

interface CodeSnippet {
    language: string
    code: string
}

interface Question {
    id: string
    title: string
    description: string
    difficulty: string
    hints: string[]
    companies: string[]
    tags: string[]
    testCases: TestCase[]
    codeSnippets: CodeSnippet[]
    slug: string
}

interface QuestionsData {
    message: string
    data: Question[]
}

interface SingleQuestion {
    message: string
    data: Question
}

export const questionApi = createApi({
    reducerPath: 'questionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/questions',
        credentials: 'include',
    }),
    tagTypes: ['Questions', 'Question'],
    endpoints: (builder) => ({
        getQuestions: builder.query<QuestionsData, string>({
            query: (q) => q != "" ? `/?q=${q}` : `/`,
            providesTags: ['Questions']
        }),
        getQuestionById: builder.query<SingleQuestion, string>({
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
