import { useRouter } from "next/router";

export default function Custom404() {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="container">
				<div className="text-center">
					<h1 className="text-6xl font-semibold text-gray-800">404</h1>
					<p className="text-gray-500 mt-4">Oops! Page not found.</p>
					<p className="mt-2 text-gray-500">{`The page you're looking for doesn't exist.`}</p>
					<button
						onClick={() => router.push("/feed/all")}
						className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none"
					>
						Go Home
					</button>
				</div>
			</div>
		</div>
	);
}
