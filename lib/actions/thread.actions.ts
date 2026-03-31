"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
    connectToDB();
    const thread = await Thread.create({
        text,
        author,
        community: null
    })

    await User.findByIdAndUpdate(author, {
        $push: { threads: thread._id }
    })

    revalidatePath(path)
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    connectToDB()

    const skipCount = (pageNumber - 1) * pageSize

    // Fetch the threads that have no parents (top-level threads...)
    const threadQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipCount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })
    const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

    const threads = await threadQuery.exec();
    const isNext = totalThreadsCount > skipCount + threads.length;

    return { threads, isNext }
}

export async function fetchThreadById(threadId: string) {
    try {
        // TODO: POPULATE Community
        const thread = await Thread.findById(threadId)
            .populate({
                path: 'author',
                model: User,
                select: "_id clerkId name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id clerkId name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id clerkId name parentId image"
                        }
                    }
                ]
            }).exec();

        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${error.message}`)
    }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    connectToDB();
    console.log({
        threadId,
        commentText,
        userId,
        path,
    })
    try {
        // find the originalThread by its Id
        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error("Thread not found")
        }
        // create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })
        // save the new thread
        const savedCommentThread = await commentThread.save()

        // update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id)

        // save the original thread
        await originalThread.save()

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error adding comment: ${error.message}`)
    }
}