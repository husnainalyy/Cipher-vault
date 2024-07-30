'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import usersData from '@/profileUsers.json';
import { useToast } from '@/components/ui/use-toast';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';

interface User {
    username: string;
}

export default function Home() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(usersData.users);
    }, []);

    const { toast } = useToast();
    const copyToClipboard = (profileUrl: string) => {
        navigator.clipboard.writeText(profileUrl).then(() => {
            toast({
                title: 'URL Copied!',
                description: 'Profile URL has been copied to clipboard.',
            });
        }).catch((err) => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div >
            <main className="flex-grow w-full    lg:h-screen  flex flex-col items-center justify-center px-4 md:px-24  bg-[#161616] text-white">
                <section className="flex flex-col lg:flex-row w-full justify-between mb-8 md:mb-12">
                    <div className='w-full lg:w-1/5 pt-4 lg:pt-0 text-center lg:text-left '>
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Explore anonymous
                        </h1>
                        <p className="mt-3 md:mt-4 text-base md:text-lg text-indigo-300">
                            Share feedback anonymously and easily
                        </p>
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700">View User Profiles</Button>
                            </DrawerTrigger>
                            <DrawerContent className='bg-[#161616] text-white border-zinc-800 px-2'>
                                <DrawerHeader className='flex flex-col justify-center items-center'>
                                    <DrawerTitle>User Profiles</DrawerTitle>
                                    <DrawerDescription>Copy others unique link</DrawerDescription>
                                </DrawerHeader>
                                <ul className="list-disc pl-5">
                                    {users.map((user: User, index: number) => {
                                        const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/u/${user.username}` : '';
                                        return (
                                            <li key={index} className="mb-4">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        value={profileUrl}
                                                        disabled
                                                        className="input input-bordered rounded-lg bg-[#333131] text-white w-full p-2 mr-2"
                                                    />
                                                    <Button className='bg-gray-300 text-black hover:bg-zinc9-700' onClick={() => copyToClipboard(profileUrl)}>Copy</Button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <DrawerFooter>
                                    <DrawerClose>
                                        <Button variant="white">Close</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    </div>
                    <div className='w-full lg:w-2/5 pt-4 pe-4 ps-8'>
                        <div className="relative inline- w-full h-72">
                            <div className=" rounded-3xl shadow-lg w-full h-full  bg-[#2d2d2d]"></div>
                            <img
                                src='https://res.cloudinary.com/drqjypmpx/image/upload/f_auto,q_auto/qstqweacpmlxnqpf9pbz'
                                alt="Main"
                                className="rounded-3xl absolute top-2 right-12 h-full w-full border-2 border-zinc-700  transform translate-x-3 translate-y-3"
                            />
                        </div>
                    </div>
                </section>

                <Carousel
                    plugins={[Autoplay({ delay: 2000 })]}
                    className="w-full max-w-lg md:max-w-xl"
                >
                    <CarouselContent>
                        {messages.map((message: any, index: number) => (
                            <CarouselItem key={index} className="p-4 px-8">
                                <Card className="bg-[#161616] text-white">
                                    <CardHeader>
                                        <CardTitle>{message.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                                        <Mail className="flex-shrink-0" />
                                        <div>
                                            <p>{message.content}</p>
                                            <p className="text-xs text-indigo-200">
                                                {message.received}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                
            </main>

            
        </div>
    );
}
