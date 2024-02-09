class Routes {
	static ViewStory(genre: string, id: string) {
		return `/video/${genre}/${id}/view`;
	}
	static EditStory(genre: string, id: string) {
		return `/video/${genre}/${id}/edit`;
	}
	static CreateStoryFromRoute(params: {
		image_style: number;
		language: number;
		length: number;
		prompt: string;
	}) {
		const stringified = Object.fromEntries(
			Object.entries(params).map(([key, value]) => [key, value.toString()])
		);
		const urlParams = new URLSearchParams(stringified);
		return `/video/create?${urlParams}`;
	}
	static Logout(returnTo = "/") {
		return `/api/auth/logout?returnTo=${returnTo}`;
	}
}
export default Routes;
