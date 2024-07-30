import { z } from 'zod'

export const messageSchema = z.object({
    message: z.string().min(10).max(300, "the message should not be more than 300 characters"),
});