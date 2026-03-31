import * as z from "zod"

export const threadValidation = z.object({
    thread: z.string().nonempty().min(3, { error: "Minimum 3 characters" }),
    accountId: z.string(),
})

export type ThreadValidation = z.infer<typeof threadValidation>

export const commentValidation = z.object({
    thread: z.string().nonempty().min(3, { error: "Minimum 3 characters" }),
})

export type CommentValidation = z.infer<typeof commentValidation>