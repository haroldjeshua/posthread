import { VscRefresh } from "react-icons/vsc";

type LoadingSpinngerProps = {
	big?: boolean;
}

export default function LoadingSpinner({ big = false }: LoadingSpinngerProps) {
	const sizeClasses = big ? "w-16 h-16" : "w-8 h-8"
	
	return (
		<div className="flex justify-center p2">
			<VscRefresh className={`animate-spin ${sizeClasses}`} />
		</div>
	)
}
