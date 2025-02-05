"use client";

import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/shared/header/Header';

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    difficulty: z.string(),
    testCases: z.array(z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional()
    })).min(1, "At least one test case is required"),
    tags: z.array(z.string()).min(1, "At least one topic is required"),
    hints: z.array(z.string()),
    companies: z.array(z.string()),
    codeSnippets: z.object({
        javascript: z.string(),
        python: z.string(),
        java: z.string(),
        cpp: z.string(),
    })
});

export default function CreateProblemPage() {
    const [topics, setTopics] = React.useState<string[]>([]);
    const [newTopic, setNewTopic] = React.useState("");
    const [testCases, setTestCases] = React.useState([{ input: "", output: "", explanation: "" }]);
    const [hints, setHints] = React.useState<string[]>([]);
    const [newHint, setNewHint] = React.useState("");
    const [difficulty, setDifficulty] = React.useState("Easy");
    const [companies, setCompanies] = React.useState<string[]>([]);
    const [newCompany, setNewCompany] = React.useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: "Easy",
            testCases: [{ input: "", output: "", explanation: "" }],
            tags: [],
            hints: [],
            companies: [],
            codeSnippets: {
                javascript: "",
                python: "",
                java: "",
                cpp: "",
            }
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        // try {
        //     const response = await axios.post(
        //         "http://localhost:8000/api/v1/questions/create",
        //         values,
        //         {
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             withCredentials: true,
        //         }
        //     )
        //     if (!response.data) {
        //         return
        //     }
        //     toast.success(response.data?.message)
        // } catch (error) {
        //     console.log("Error submitting problem:", error)
        // }
    }

    const addTopic = () => {
        if (newTopic && !topics.includes(newTopic)) {
            const allTopics = [...topics, newTopic];
            setTopics(allTopics);
            form.setValue("tags", allTopics);
            setNewTopic("");
        }
    };

    const removeTopic = (topicToRemove: string) => {
        const updatedTopics = topics.filter(topic => topic !== topicToRemove);
        setTopics(updatedTopics);
        form.setValue("tags", updatedTopics);
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: "", output: "", explanation: "" }]);
    };

    const removeTestCase = (index: number) => {
        const updatedTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(updatedTestCases);
        form.setValue("testCases", updatedTestCases);
    };

    const addHint = () => {
        if (newHint) {
            const updatedHints = [...hints, newHint];
            setHints(updatedHints);
            form.setValue("hints", updatedHints);
            setNewHint("");
        }
    };

    const removeHint = (index: number) => {
        const updatedHints = hints.filter((_, i) => i !== index);
        setHints(updatedHints);
        form.setValue("hints", updatedHints);
    };

    const addCompany = () => {
        if(newCompany && !companies.includes(newCompany)){
            const updatedCompanies = [...companies, newCompany];
            setCompanies(updatedCompanies);
            form.setValue("companies", updatedCompanies);
            setNewCompany("");
        }
    }

    const removeCompany = (companyToRemove: string)=>{
        const updatedCompanies = companies.filter(company => company != companyToRemove);
        setCompanies(updatedCompanies);
        form.setValue("companies", updatedCompanies);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-600 to-blue-900 container mx-auto p-4">
            <Header />
            <Card className='mt-20'>
                <CardHeader>
                    <CardTitle>Create New Problem</CardTitle>
                    <CardDescription>
                        Submit a new coding problem for review. Once approved, it will be available on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Title</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Two Sum" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Description</FormLabel>
                                    <FormControl>
                                    <Textarea
                                        placeholder="Describe the problem in detail. You can use markdown."
                                        className="h-32"
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="difficulty"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Problem Difficulty</FormLabel>
                                    <FormControl>
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            setDifficulty(value);
                                            form.setValue("difficulty", value);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <FormLabel>Test Cases</FormLabel>
                                {testCases.map((testCase, index) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder="Input"
                                                value={testCase.input}
                                                onChange={(e) => {
                                                    const updatedTestCases = [...testCases];
                                                    updatedTestCases[index].input = e.target.value;
                                                    setTestCases(updatedTestCases);
                                                    form.setValue("testCases", updatedTestCases);
                                                }}
                                            />
                                            <Input
                                                placeholder="Expected Output"
                                                value={testCase.output}
                                                onChange={(e) => {
                                                    const updatedTestCases = [...testCases];
                                                    updatedTestCases[index].output = e.target.value;
                                                    setTestCases(updatedTestCases);
                                                    form.setValue("testCases", updatedTestCases);
                                                }}
                                            />
                                            <Input
                                                placeholder="Explanation (optional)"
                                                value={testCase.explanation}
                                                onChange={(e) => {
                                                    const updatedTestCases = [...testCases];
                                                    updatedTestCases[index].explanation = e.target.value;
                                                    setTestCases(updatedTestCases);
                                                    form.setValue("testCases", updatedTestCases);
                                                }}
                                            />
                                        </div>
                                        {testCases.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => removeTestCase(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            <Button type="button" variant="outline" onClick={addTestCase}>
                                Add Test Case
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Topics</FormLabel>
                            <div className="flex gap-2 flex-wrap">
                                {topics.map((topic) => (
                                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                                        {topic}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeTopic(topic)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a topic"
                                    value={newTopic}
                                    onChange={(e) => setNewTopic(e.target.value)}
                                />
                                <Button type="button" onClick={addTopic}>
                                    Add
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Hints</FormLabel>
                            {hints.map((hint, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <Input value={hint} disabled />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeHint(index)}
                                        >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <div className="flex gap-2">
                            <Input
                                placeholder="Add a hint"
                                value={newHint}
                                onChange={(e) => setNewHint(e.target.value)}
                            />
                            <Button type="button" onClick={addHint}>
                                Add
                            </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Companies</FormLabel>
                            <div className='flex flex-wrap gap-2'>
                                {companies.map((company, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {company}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => removeCompany(company)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add a company"
                                    value={newCompany}
                                    onChange={(e) => setNewCompany(e.target.value)}
                                />
                                <Button type="button" onClick={addCompany}>
                                    Add
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FormLabel>Code Snippets</FormLabel>
                            <FormField
                                control={form.control}
                                name="codeSnippets.javascript"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>JavaScript</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="JavaScript code template"
                                        className="font-mono h-32"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="codeSnippets.python"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Python</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Python code template"
                                        className="font-mono h-32"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="codeSnippets.java"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Java</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="Java code template"
                                        className="font-mono h-32"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="codeSnippets.cpp"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>C++</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="C++ code template"
                                        className="font-mono h-32"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Submit for Review
                        </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
