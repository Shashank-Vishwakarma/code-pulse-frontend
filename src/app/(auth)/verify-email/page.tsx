"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {z} from "zod"

const verifyEmailFormSchema = z.object({
    email: z.string({message: "Please provide your email"}).email({message: "Please provide a valid email address"}),
    code: z.string({message: "Please provide verification code"}).min(6, {message: "Code must be at least 6 characters"}).max(6, {message: "Code must be at most 6 characters"}),
})

export default function VerifyEmailPage() {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof verifyEmailFormSchema>>({
        resolver: zodResolver(verifyEmailFormSchema),
        defaultValues: {
            email: "",
            code: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof verifyEmailFormSchema>) => {
        setIsPending(true)
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/email/verify",
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
            console.log("Error in verify email", error)
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Something went wrong")
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-white space-y-8 bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-gray-300 mt-2">
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
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
                            name="code"
                            render={({field}) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your verification code"
                                        {...field}
                                        className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <Button disabled={isPending} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            {isPending ? "Verifying..." : "Verify"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}