"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { QueryFilter, SortOrder } from "mongoose";
import Community from "../models/community.model";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}

export async function updateUser(
    { userId, username, name, bio, image, path }: Params
): Promise<void> {
    await connectToDB();

    try {
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
            },
            {
                upsert: true
            }
        )

        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(id: string) {
    try {
        connectToDB();
        const user = await User.findOne({ clerkId: id }).populate({
            path: 'communities',
            model: Community
        })
        return user;
    }
    catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    connectToDB()
    try {
        // find all threads authored by user with given userId
        const threads = await User.findOne({ clerkId: userId }).populate({
            path: 'threads',
            model: Thread,
            populate: [
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image clerkId'
                    }
                },
                {
                    path: 'community',
                    model: Community,
                    select: "_id id name image"
                }
            ]
        })
        return threads
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}) {
    try {
        connectToDB();
        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchString, "i");

        const query: QueryFilter<typeof User> = {
            clerkId: { $ne: userId }
        }

        if (searchString.trim() !== " ") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsers = await User.countDocuments(query);

        const isNext = totalUsers > skipAmount + users.length;

        return { users, isNext }
    } catch (error: any) {
        throw new Error(`Error fetching the users: ${error.message}`)
    }
}

export async function getNotification(userId: string) {
    try {
        // find all threads created by user
        const userThreads = await Thread.find({ author: userId })

        // collect all the child thread ids( replies) from the 'children' field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: "name image _id"
        })

        return replies
    } catch (error: any) {
        throw new Error(`Failed to fetch activity: ${error.message}`)
    }
}