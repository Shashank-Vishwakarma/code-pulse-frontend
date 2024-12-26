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
import { startTransition, useActionState } from "react"
import { signUpAction } from "@/actions/auth"
import { toast } from "sonner"

const signUpFormSchema = z.object({
    name: z.string({message: "Please provide your name"}),
    email: z.string({message: "Please provide your email"}).email({message: "Please provide a valid email address"}),
    username: z.string({message: "Please provide your username"}).min(3, {message: "Username must be at least 3 characters"}).max(20, {message: "Username must be at most 20 characters"}),
    password: z.string({message: "Please provide your password"}).min(8, {message: "Password must be at least 6 characters"}).max(20, {message: "Password must be at most 20 characters"}),
    confirmPassword: z.string({message: "Please provide confirm password"}).min(8, {message: "Confirm Password must be at least 6 characters"}).max(20, {message: "Confirm Password must be at most 20 characters"}),
})

const initialState = {
    message: "",
}

export default function SignUpPage() {
    const [state, formAction, pending] = useActionState(signUpAction, initialState)

    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
        }
    })

    const onSubmit = (data: z.infer<typeof signUpFormSchema>) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("email", data.email)
        formData.append("username", data.username)
        formData.append("password", data.password)
        formData.append("confirmPassword", data.confirmPassword)
        startTransition(()=>{
            formAction(formData)
        })
        toast(state?.message)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Create an account on <Link href="/" className="text-blue-400 hover:text-blue-300">CodePulse</Link>
                    </h2>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="John Doe" 
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
                                <FormLabel className="text-white">
                                    Email
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
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">
                                    Username
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="akjdwee3112" 
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
                        <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">
                                    Confirm Password
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

                        <Button disabled={pending} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Sign Up
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
                            Already have an account?{" "}
                            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}