"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    username: z.string().min(2, { message: "Username must be at least 2 characters.", }),
    email: z.string().email({ message: "Invalid email address.", }),
    password: z.string().min(8, { message: "Password must be at least 8 characters.", }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters.", }),
}).refine(({password, confirmPassword}) => password === confirmPassword, {message: "Passwords do not match.", path: ["confirmPassword"]})

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/forgot-password",
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            if (!response.data) {
                toast.error(response.data?.message)
                return
            }
            toast.success(response.data?.message)
            router.replace("/login")
        } catch (error) {
            console.log("Error in forgot password", error)
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md text-white w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="mt-2 text-sm text-gray-300">
                        Enter the details to reset your password
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter your username" 
                                            {...field} 
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter your email"
                                            {...field} 
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Enter new password" 
                                            type="password"
                                            {...field} 
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Confirm new password" 
                                            type="password"
                                            {...field} 
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                            disabled={isLoading}
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center text-sm">
                    <Link 
                        href="/login" 
                        className="font-medium text-blue-400 hover:text-blue-300"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
