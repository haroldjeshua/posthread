import { useSession } from "next-auth/react";
import { useState } from "react";
import InfiniteThreadList from "~/components/InfiniteThreadList";
import { NewThreadForm } from "~/components/NewThreadForm";
import { api } from "~/utils/api";

const TABS = ["Recent", "Following"] as const;

export default function Home() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();

  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                  tab === selectedTab
                    ? "border-b-4 border-b-blue-400 font-bold"
                    : ""
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>
      <NewThreadForm />
      {selectedTab === "Recent" ? <RecentThreads /> : <FollowingThreads />}
    </>
  );
}

function RecentThreads() {
  const threads = api.thread.infiniteFeed.useInfiniteQuery(
    {},
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteThreadList
      threads={threads.data?.pages.flatMap((page) => page.threads)}
      isError={threads.isError}
      isLoading={threads.isLoading}
      hasMore={threads.hasNextPage}
      fetchNewThreads={threads.fetchNextPage}
    />
  );
}

function FollowingThreads() {
  const threads = api.thread.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <InfiniteThreadList
      threads={threads.data?.pages.flatMap((page) => page.threads)}
      isError={threads.isError}
      isLoading={threads.isLoading}
      hasMore={threads.hasNextPage}
      fetchNewThreads={threads.fetchNextPage}
    />
  );
}
