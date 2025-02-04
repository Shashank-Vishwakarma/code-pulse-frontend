import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export interface Comment {
    id:        string
    body:      string
    userId:    string
    blogId:    string
    createdAt: string
}

export interface Blog {
    id: string
    title: string
    body: string
    imageUrl: string
    slug: string
    comments: Comment[]
    authorId: string
    createdAt: string
}

export interface BlogData {
    message: string
    data: Blog[]
}

export interface SingleBlog {
    message: string
    data: Blog
}

export const blogApi = createApi({
    reducerPath: 'blogApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/blogs',
        credentials: 'include',
    }), 
    tagTypes: ['Blogs', 'Blog'],
    endpoints: (builder) => ({
        getBlogs: builder.query<BlogData, string>({
            query: (q) => q != "" ? `/?q=${q}` : `/`,
            providesTags: ['Blogs']
        }),
        getBlogById: builder.query<SingleBlog, string>({
            query: (id) => `/${id}`,
            providesTags: ['Blog']
        }),
        createBlog: builder.mutation({
            query: (data: FormData) => ({
                url: '/create',
                body: data,
                method: 'POST',
            }),
            invalidatesTags: ['Blogs']
        }),
        updateBlog: builder.mutation({
            query: ({id, data}) => ({
                url: `/${id}`,
                body: data,
                method: 'PUT'
            }),
            invalidatesTags: ['Blog']
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Blogs']
        })
    })
})

export const {useGetBlogsQuery, useGetBlogByIdQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation} = blogApi
