'use client'
import { useToast } from '@/components/ui/use-toast'
import { useParams, useRouter } from 'next/navigation';
import React,{useState} from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from '@/schemas/signInSchema';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {signIn} from 'next-auth/react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';


const SignIn = () => {
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: "Login Failed",
                    description: result.error,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive",
                });
            }
        }

        if (result?.url) {
            router.replace('/dashboard');
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-full max-w-md p-8  bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Signin <br /> Cipher Vault
                    </h1>
                    <p className="mb-4 text-[#161616]">Sign In to start your anonymous adventure</p>
                </div>
                
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Username</FormLabel>
                                    <Input {...field} name="identifier" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} name="password" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full mt-4 bg-[#161616] hover:bg-[#444343]' >
                            SignIn
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member?{' '}
                        <Link href="/signUp" className="text-blue-600 hover:text-blue-800">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn