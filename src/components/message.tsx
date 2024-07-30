"use client "
import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Message } from '@/models/user.model';
import { useToast } from './ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import axios from 'axios';
import moment from 'moment';

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/deleteMessage/${message._id}`);
            toast({
                title: response.data.message,
            });
            onMessageDelete(message._id as string);
        } catch (error) {
            console.error('Failed to delete message:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the message.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className='flex justify-between'>
                        <CardTitle>{message.content}</CardTitle>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"><X className='w-5 h-5' /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the message.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{moment(message.createdAt).format('LLL')}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default MessageCard;
