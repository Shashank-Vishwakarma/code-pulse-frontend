import { formSchema } from "@/app/problems/create/page";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { z } from "zod";

export interface TestCase {
    input: string;
    output: string;
    explanation?: string;
}

export interface CodeSnippet {
    language: string;
    code: string;
}

export interface Question {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    hints: string[];
    companies: string[];
    tags: string[];
    testCases: TestCase[];
    codeSnippets: CodeSnippet[];
    slug: string;
}

export interface QuestionsData {
    message: string;
    data: Question[];
}

export interface SingleQuestion {
    message: string;
    data: Question;
}

// submissions on a question
interface Submission {
    id: string;
    language: string;
    code: string;
    createdAt: string;
}

export interface CodeSubmission {
    message: string;
    data: Submission[];
}

export const questionApi = createApi({
    reducerPath: "questionApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/questions`,
        credentials: "include",
    }),
    tagTypes: ["Questions", "Question"],
    endpoints: (builder) => ({
        getQuestions: builder.query<QuestionsData, string>({
            query: (q) => (q != "" ? `/?q=${q}` : `/`),
            providesTags: ["Questions"],
        }),
        getQuestionById: builder.query<SingleQuestion, string>({
            query: (id) => `/${id}`,
            providesTags: ["Question"],
        }),
        getSubmissionsOnAQuestion: builder.query<CodeSubmission, string>({
            query: (id: string) => `/${id}/submissions`,
        }),
        createQuestion: builder.mutation({
            query: (data: z.infer<typeof formSchema>) => ({
                url: "/create",
                body: data,
                method: "POST",
            }),
            invalidatesTags: ["Questions"],
        }),
        updateQuestion: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                body: data,
                method: "PUT",
            }),
            invalidatesTags: ["Question"],
        }),
        deleteQuestion: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Questions"],
        }),
    }),
});

export const {
    useGetQuestionsQuery,
    useGetQuestionByIdQuery,
    useGetSubmissionsOnAQuestionQuery,
    useCreateQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
} = questionApi;
