'use client'
import { useToast } from '@/components/ui/use-toast'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';


const VerifyAccount = () => {

    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '', 
        },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verifyCode`, {
                username: params.username,
                code: data.code
            })
            toast({
                title: 'Success',
                description: response.data.message,
            });
            router.replace('/signIn');
        } catch (error) {
            console.error('Error during signUp:', error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Sign Up Failed w',
                description: axiosError.response?.data.message,
                variant: 'destructive',
            });
        }
    }
    return (
        <div>
            <div className="flex justify-center items-center min-h-screen ">
                <div className="w-full max-w-md p-8  bg-white rounded-xl shadow-lg">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
                            Verify your account
                        </h1>
                        <p className="mb-4">Enter the verification code which is sent on your email</p>
                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-">
                                <FormField
                                    name="code"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='code'{...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <Button type="submit" className='w-full mt-4 bg-[#161616] hover:bg-[#444343]' >
                                    SignUp
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default VerifyAccount