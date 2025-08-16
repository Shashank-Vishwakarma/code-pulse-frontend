import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
    name: string;
    username: string;
}

export interface Comment {
    id: string;
    body: string;
    userId: string;
    user: User;
    blogId: string;
    createdAt: string;
}

interface Author {
    name: string;
    username: string;
}

export interface Blog {
    id: string;
    title: string;
    body: string;
    imageUrl: string;
    slug: string;
    isBlogPublished: boolean;
    comments: Comment[];
    authorId: string;
    author: Author;
    createdAt: string;
}

export interface BlogData {
    message: string;
    data: Blog[];
}

export interface SingleBlog {
    message: string;
    data: Blog;
}

export const blogApi = createApi({
    reducerPath: "blogApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/blogs`,
        credentials: "include",
    }),
    tagTypes: ["Blogs", "Blog"],
    endpoints: (builder) => ({
        getBlogs: builder.query<BlogData, string>({
            query: (q) => (q != "" ? `/?q=${q}` : `/`),
            providesTags: ["Blogs"],
        }),
        getBlogById: builder.query<SingleBlog, string>({
            query: (id) => `/${id}`,
            providesTags: ["Blog"],
        }),
        createBlog: builder.mutation({
            query: (data: FormData) => ({
                url: "/create",
                body: data,
                method: "POST",
            }),
            invalidatesTags: ["Blogs"],
        }),
        updateBlog: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                body: data,
                method: "PUT",
            }),
            invalidatesTags: ["Blog"],
        }),
        deleteBlog: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blogs"],
        }),
        createComment: builder.mutation({
            query: ({ id, body }: { id: string; body: string }) => ({
                url: `/${id}/comments`,
                body: {
                    body,
                },
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogByIdQuery,
    useCreateBlogMutation,
    useUpdateBlogMutation,
    useDeleteBlogMutation,
    useCreateCommentMutation,
} = blogApi;
