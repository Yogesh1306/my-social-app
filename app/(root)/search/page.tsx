import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import SearchBar from "@/components/shared/SearchBar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;
  const { q, page } = await searchParams;

  const userInfo = await fetchUser(user?.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: q,
    pageNumber: page ? +page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* search bar */}
      <SearchBar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          <>
            {result.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.clerkId}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                userType="User"
              />
            ))}
          </>
        )}
      </div>
      <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </section>
  );
};

export default Page;
