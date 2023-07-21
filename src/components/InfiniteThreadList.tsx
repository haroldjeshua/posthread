import InfiniteScroll from "react-infinite-scroll-component";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { VscHeartFilled, VscHeart } from "react-icons/vsc";
import IconHoverEffect from "./IconHoverEffect";

type Thread = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
};

type InfiniteThreadListProps = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  fetchNewThreads: () => Promise<unknown>;
  threads?: Thread[];
};

export default function InfiniteThreadList({
  threads,
  isError,
  isLoading,
  fetchNewThreads,
  hasMore,
}: InfiniteThreadListProps) {
  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error...</h1>;
  if (threads == null || threads.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">
        No Threads Yet
      </h2>
    );
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={threads.length}
        next={fetchNewThreads}
        hasMore={hasMore}
        loader={"Loading..."}
      >
        {threads.map((thread) => (
          <ThreadCard key={thread.id} {...thread} />
        ))}
      </InfiniteScroll>
    </ul>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
});

function ThreadCard({
  id,
  user,
  content,
  createdAt,
  likeCount,
  likedByMe,
}: Thread) {
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profiles/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            href={`/profiles/${user.id}`}
            className="font-semibold hover:underline focus-visible:underline"
          >
            {user.name}
          </Link>
          <span className="text-gray-500">·</span>
          <time className="flex flex-wrap items-center text-sm font-light text-gray-500">
            {dateTimeFormatter.format(createdAt)}
          </time>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <LikeButton likedByMe={likedByMe} likeCount={likeCount} />
      </div>
    </li>
  );
}

type LikeButtonProps = {
  likedByMe: boolean;
  likeCount: number;
};

function LikeButton({ likedByMe, likeCount }: LikeButtonProps) {
  const session = useSession();
  const LikeIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
		return (
			<div className="flex items-center gap-3 self-start text-gray-500 mt-1 mb-1">
				<LikeIcon />
				<span>{likeCount}</span>
			</div>
		)
  }

  return (
    <button
      className={`group flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:fill-red-500"
      }`}
    >
			<IconHoverEffect red>
				<LikeIcon
					className={`transition-colors duration-200 -ml-2 ${
						likedByMe
						? "fill-red-500"
						: "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
					}`}
					/>
				</IconHoverEffect>
			<span>{likeCount}</span>
    </button>
  );
}
