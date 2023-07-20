type Thread = {
	id:	string
	content: string
	createdAt: Date
	likeCount: number
	likedByMe: boolean
	user: { id: string, image: string | null, name: string | null }
}

type InfiniteThreadListProps = {
	isLoading: boolean
	isError: boolean
	hasMore: boolean
	fetchNewThreads: () => Promise<unknown>
	threads?: Thread[]
}

export default function InfiniteThreadList({ threads, isError, isLoading, fetchNewThreads, hasMore }: InfiniteThreadListProps) {
	if (isLoading) return <h1>Loading...</h1>
	if (isError) return <h1>Error...</h1>
	if (threads == null || threads.length === 0) {
		return <h2 className="my-4 text-center text-2xl text-gray-500">No Threads Yet</h2>
	}

	return <ul>
		<li>Thread list goes here</li>
	</ul>
}
