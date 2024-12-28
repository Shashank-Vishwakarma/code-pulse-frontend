"use client"

import Link from "next/link"
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

// import { Github, Linkedin } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { useAppDispatch } from "@/hooks/redux"
import { setUser } from "@/states/slices/authSlice"

const loginFormSchema = z.object({
    identifier: z.string({message: "Please provide your email or username"}),
    password: z.string({message: "Please provide your password"}).min(8, {message: "Password must be at least 6 characters"}).max(20, {message: "Password must be at most 20 characters"}),
})

export default function LoginPage() {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            identifier: "",
            password: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
        setIsPending(true)
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/login",
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
            dispatch(setUser(response.data?.data))
            localStorage.setItem("user", JSON.stringify(response.data?.data))
            router.replace("/problems")
        } catch (error) {
            console.log("Error in login", error)
            toast.error("Something went wrong")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Sign in to <Link href="/" className="text-blue-400 hover:text-blue-300">CodePulse</Link>
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">
                        Continue your coding journey
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">
                                    Email or Username
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="you@example.com" 
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
                                <FormLabel className="text-white">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-blue-400 hover:text-blue-300">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <Button disabled={isPending} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            {isPending ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6">
                    {/* <div className="relative">
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-sm text-gray-300">
                                Or continue with
                            </span>
                        </div>
                    </div> */}

                    {/* <div className="flex flex-row justify-center items-center space-x-4">
                        <div className="mt-6">
                            <Button 
                                variant="outline" 
                                className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                            >
                                <Github className="mr-2" /> GitHub
                            </Button>
                        </div>
                        <div className="mt-6">
                            <Button 
                                variant="outline" 
                                className="w-full bg-white/10 text-white hover:bg-white/20 border-white/20"
                            >
                                <Linkedin className="mr-2" /> LinkedIn
                            </Button>
                        </div>
                    </div> */}

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-300">
                            Don't have an account?{" "}
                            <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}