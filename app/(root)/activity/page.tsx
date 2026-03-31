import { fetchUser, getNotification } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user?.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const notifications = await getNotification(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activities</h1>
      <section className="mt-10 flex flex-col gap-5">
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification: any) => (
              <Link
                key={notification._id}
                href={`/thread/${notification.parentId}`}
              >
                <article className="activity-card">
                  <Image
                    src={notification.author.image}
                    alt="Profile picture"
                    width={30}
                    height={30}
                    className="rounded-full object-cover aspect-square"
                  />
                  <p className="text-small-regular! text-light-1">
                    <span className="mr-1 text-purple-500">
                      {notification.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="text-base-regular! text-light-3">No notifications yet</p>
        )}
      </section>
    </section>
  );
};

export default Page;
