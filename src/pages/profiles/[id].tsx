import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Head from "next/head";
import ErrorPage from "next/error";
import { ssgHelper } from "~/server/api/ssgHelper";
import { api } from "~/utils/api";
import Link from "next/link";
import { VscArrowLeft } from "react-icons/vsc";
import IconHoverEffect from "~/components/IconHoverEffect";
import ProfileImage from "~/components/ProfileImage";
import InfiniteThreadList from "~/components/InfiniteThreadList";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  id,
}) => {
  const { data: profile } = api.profile.getById.useQuery({ id });
  const threads = api.thread.infiniteProfileFeed.useInfiniteQuery(
    { userId: id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  if (profile == null || profile.name == null) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{`Posthread - ${profile.name}`}</title>
      </Head>
      <header className="sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2">
        <Link href=".." className="mr-2">
          <IconHoverEffect>
            <VscArrowLeft className="h-8 w-8" />
          </IconHoverEffect>
        </Link>
        <ProfileImage src={profile.image} className="flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h1 className="text-lg font-bold">{profile.name}</h1>
          <div className="text-gray-500">
            {profile.threadsCount}{" "}
            {getPlural(profile.threadsCount, "Thread", "Threads")} ·{" "}
            {profile.followersCount}{" "}
            {getPlural(profile.followersCount, "Follower", "Followers")} ·{" "}
            {profile.followsCount} Following
          </div>
        </div>
				<FollowButton
					isFollowing={profile.isFollowing}
					userId={id}
					onClick={() => null}
				/>
      </header>
      <main>
        <InfiniteThreadList
          threads={threads.data?.pages.flatMap((page) => page.threads)}
          isError={threads.isError}
          isLoading={threads.isLoading}
          hasMore={threads.hasNextPage}
          fetchNewThreads={threads.fetchNextPage}
        />	
      </main>
    </>
  );
};

function FollowButton() {
  return <h1>Follow</h1>;
}

const pluralRules = new Intl.PluralRules();
function getPlural(number: number, singular: string, plural: string) {
  return pluralRules.select(number) === "one" ? singular : plural;
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;

  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  // server side generation helper
  const ssg = ssgHelper();
  await ssg.profile.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;
