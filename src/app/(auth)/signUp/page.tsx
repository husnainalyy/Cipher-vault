'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts'
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUp() {
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback((value) => {
        form.setValue('username', value);
        checkUsernameUnique(value);
    }, 500);

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const checkUsernameUnique = async (username: string) => {
        if (!username) {
            console.error('Username is required');
            return;
        }

        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
            const response = await axios.get(`/api/checkUniqueUsername`, {
                params: { username }
            });
            if (response.status === 200) {
                console.log('Username is unique');
            } else {
                console.error('Error checking username uniqueness');
            }
            setUsernameMessage(response.data.message);
        } catch (error: any) {
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(
                axiosError.response?.data.message ?? 'Error checking username'
            );
        } finally {
            setIsCheckingUsername(false);
        }
    };

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            if (!data.username) {
                throw new Error('Username is required');
            }
            const response = await axios.post<ApiResponse>('/api/signUp', data);

            toast({
                title: 'Success',
                description: response.data.message,
            });

            router.replace(`/verifyCode/${data.username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error('Error during signUp:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            // Default error message
            let errorMessage = axiosError.response?.data.message ?? 'There was a problem with your sign-up. Please try again.';


            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant: 'destructive',
            });

            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen ">
            <div className="w-full max-w-md p-8  bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        SignUp <br /> Cipher Vault
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

               
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        {...field}
                                        name="username"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            const value = e.target.value;
                                            if (value === '') {
                                                setUsernameMessage('');     
                                            }
                                            debounced(value);
                                        }}
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${usernameMessage === 'Username is unique'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} name="email" />
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
                        <Button type="submit" className='w-full mt-4 bg-[#161616] hover:bg-[#444343]' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/signIn" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}