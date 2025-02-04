"use client"

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAppDispatch } from '@/hooks/redux'
import { setUser } from '@/states/slices/authSlice'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export function Profile() {
    const dispatch = useAppDispatch()
    const router = useRouter()

    const onContinue = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            )
            if (!response.data) {
                toast.error(response.data?.message)
                return
            }
            toast.success(response.data?.message)
            window.localStorage.removeItem("user")
            dispatch(setUser(null))
            router.replace("/login")
        } catch (error) {
            console.log("Error in logout", error)
            toast.error("Something went wrong")
        }
    }

    return (
        <Avatar className='cursor-pointer'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <AvatarFallback>S</AvatarFallback>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem 
                            className='cursor-pointer'
                            onClick={() => {
                                router.push("/accounts/profile")
                            }}
                        >Profile</DropdownMenuItem>
                        <DropdownMenuItem 
                            className='cursor-pointer'
                            onClick={onContinue}
                        >Logout</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </Avatar>
    )
}
