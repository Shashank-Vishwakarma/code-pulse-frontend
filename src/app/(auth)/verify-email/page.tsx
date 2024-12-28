"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"

const verifyEmailFormSchema = z.object({
    email: z.string({message: "Please provide your email"}).email({message: "Please provide a valid email address"}),
    code: z.string({message: "Please provide verification code"}).min(6, {message: "Code must be at least 6 characters"}).max(6, {message: "Code must be at most 6 characters"}),
})

export default function VerifyEmailPage() {
    const form = useForm<z.infer<typeof verifyEmailFormSchema>>({
        resolver: zodResolver(verifyEmailFormSchema),
        defaultValues: {
            email: "",
            code: "",
        }
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md">
            <div className="text-center">
            <h1 className="text-2xl font-bold">Verify Your Email</h1>
            <p className="text-muted-foreground mt-2">
                Enter the verification code sent to your email
            </p>
            </div>
            <Form {...form}>
                <form className="space-y-3">
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

                    <Button disabled={false} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Verify
                    </Button>
                </form>
            </Form>
        </div>
        </div>
    )
}