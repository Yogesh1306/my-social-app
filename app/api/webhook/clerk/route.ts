import { addMemberToCommunity, createCommunity, deleteCommunity, removeUserFromCommunity, updateCommunityInfo } from '@/lib/actions/community.actions';
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'


export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req)

        const eventType = evt.type
        if (eventType === "organization.created") {
            const { id, name, slug, image_url, created_by } =
                evt?.data ?? {};

            try {

                await createCommunity(
                    id,
                    name,
                    slug,
                    image_url || "",
                    "org bio",
                    created_by || ""
                );

                return NextResponse.json({ message: "User created" }, { status: 201 });
            } catch (err) {
                console.log(err);
                return NextResponse.json(
                    { message: "Internal Server Error" },
                    { status: 500 }
                );
            }
        }

        if (eventType === "organizationInvitation.created") {
            try {
                console.log("Invitation created", evt?.data);

                return NextResponse.json(
                    { message: "Invitation created" },
                    { status: 201 }
                );
            } catch (err) {
                console.log(err);

                return NextResponse.json(
                    { message: "Internal Server Error" },
                    { status: 500 }
                );
            }
        }

        if (eventType === "organizationMembership.created") {
            try {

                // Show what evt?.data sends from above resource
                const { organization, public_user_data } = evt?.data;
                console.log("created", evt?.data);

                await addMemberToCommunity(organization.id, public_user_data.user_id);

                return NextResponse.json(
                    { message: "Invitation accepted" },
                    { status: 201 }
                );
            } catch (err) {
                console.log(err);

                return NextResponse.json(
                    { message: "Internal Server Error" },
                    { status: 500 }
                );
            }
        }

        // Listen member deletion event
        if (eventType === "organizationMembership.deleted") {
            try {

                const { organization, public_user_data } = evt?.data;
                console.log("removed", evt?.data);


                await removeUserFromCommunity(public_user_data.user_id, organization.id);

                return NextResponse.json({ message: "Member removed" }, { status: 201 });
            } catch (err) {
                console.log(err);

                return NextResponse.json(
                    { message: "Internal Server Error" },
                    { status: 500 }
                );
            }
        }

        // Listen organization updation event
        if (eventType === "organization.updated") {
            try {

                // Show what evt?.data sends from above resource
                const { id, name, slug, image_url } = evt?.data;
                console.log("updated", evt?.data);


                await updateCommunityInfo(id, name, slug, image_url || "");

                return NextResponse.json({ message: "Member removed" }, { status: 201 });
            } catch (err) {
                console.log(err);

                return NextResponse.json(
                    { message: "Internal Server Error" },
                    { status: 500 }
                );
            }
        }

        // Listen organization deletion event
        if (eventType === "organization.deleted") {
            try {

                // Show what evt?.data sends from above resource
                const { id } = evt?.data;
                console.log("deleted", evt?.data);

                await deleteCommunity(id || "");

                return NextResponse.json(
                    { message: "Organization deleted" },
                    { status: 201 }
                );
            } catch (err) {
                console.log(err);

                return NextResponse.json(
                    { message: "Internal Server Error" },
                    { status: 500 }
                );
            }
        }

        return new Response('Webhook received', { status: 200 })
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', { status: 400 })
    }
}