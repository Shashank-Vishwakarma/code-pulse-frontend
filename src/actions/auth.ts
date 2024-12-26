"use server";

import axios from 'axios';

export async function loginAction(prevState: any, formData: FormData) {
    try {
        const response = await axios.post(
            "http://localhost:8000/api/v1/auth/login",
            {
                identifier: formData.get("identifier") as string,
                password: formData.get("password") as string,
            }
        )
        if (!response.data) {
            return {message: response.data?.message}
        }
        return {message: response.data?.message}
    } catch (error) {
        console.log("Error in loginAction", error)
        return {message: "Something went wrong"}
    }
}

export async function signUpAction(prevState: any, formData: FormData) {
    try {
        const response = await axios.post(
            "http://localhost:8000/api/v1/auth/register",
            {
                email: formData.get("email") as string,
                password: formData.get("password") as string,
                confirmPassword: formData.get("confirmPassword") as string,
                username: formData.get("username") as string,
                name: formData.get("name") as string
            }
        )
        if (!response.data) {
            return {message: response.data?.message}
        }
        return {message: response.data?.message}
    } catch (error) {
        console.log("Error in signupAction", error)
        return {message: "Something went wrong"}
    }
}