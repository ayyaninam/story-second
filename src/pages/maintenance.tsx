const Maintenance = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 text-center p-4">
			<div>
				<img
					src="/images/story-logo.png"
					alt="Story Logo"
					className="mx-auto mb-8"
					style={{ maxWidth: "150px" }}
				/>
				<h1 className="text-3xl font-bold text-gray-800 mb-4">
					We&apos;re currently down for maintenance
				</h1>
				<p className="text-lg text-gray-600">
					We apologize for the inconvenience. Please check back later!
				</p>
			</div>
		</div>
	);
};

export default Maintenance;
