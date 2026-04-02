"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Community from "../models/community.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const thread = await Thread.create({
            text,
            author,
            community: communityIdObject?._id
        })

        await User.findByIdAndUpdate(author, {
            $push: { threads: thread._id }
        })

        if (communityIdObject) {
            await Community.findByIdAndUpdate(communityIdObject._id, {
                $push: { threads: thread._id },
            });
        }

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    try {
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
            .populate({
                path: 'community',
                model: Community
            })

        const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

        const threads = await threadQuery.exec();
        const isNext = totalThreadsCount > skipCount + threads.length;

        return { threads, isNext }
    } catch (error: any) {
        throw new Error(`Unable to fetch threads: ${error.message}`)
    }
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
            })
            .populate({
                path: 'community',
                model: Community,
                select: "_id id name image"
            })
            .exec();

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

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
    const childThreads = await Thread.find({ parentId: threadId });

    const descendantThreads = [];
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }

    return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
    try {
        connectToDB();
        // find the thread to be deleted
        const mainThread = await Thread.findById(id)
        if (!mainThread) {
            throw new Error("No thread exists")
        }
        // Fetch all child threads and their descendants recursively
        const descendantThreads = await fetchAllChildThreads(id)

        const descendantThreadIds = [
            id,
            ...descendantThreads.map(thread => thread._id)
        ]

        const uniqueAuthorIds = new Set(
            [
                ...descendantThreads.map(thread => thread.author?._id?.toString()),
                mainThread.author?._id?.toString(),
            ].filter(id => id !== undefined)
        )

        const uniqueCommunityIds = new Set(
            [
                ...descendantThreads.map(thread => thread.community?._id?.toString()),
                mainThread.community?._id?.toString(),
            ].filter(id => id !== undefined)
        )

        await Thread.deleteMany({ _id: { $in: descendantThreadIds } })

        await User.updateMany(
            { _id: { $in: Array.from(uniqueAuthorIds) } },
            {
                $pull: {
                    threads: {
                        $in: descendantThreadIds
                    }
                }
            }
        )

        await Community.updateMany(
            { _id: { $in: Array.from(uniqueCommunityIds) } },
            { $pull: { threads: { $in: descendantThreadIds } } }
        )

        revalidatePath(path)
    } catch (error: any) {
        throw new Error(`Failed to delete thread: ${error.message}`);
    }
}