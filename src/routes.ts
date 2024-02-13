import { CreateInitialStoryQueryParams } from "./types";

class Routes {
	static ViewStory(genre: string, id: string) {
		return `/video/${genre}/${id}`;
	}
	static EditStory(genre: string, id: string) {
		return `/video/${genre}/${id}/edit`;
	}
	static Landing() {
		return `/`;
	}
	static CreateStoryFromRoute(params: CreateInitialStoryQueryParams) {
		const stringified = Object.fromEntries(
			Object.entries(params).map(([key, value]) => [
				key,
				(value as string | number).toString(),
			])
		);
		const urlParams = new URLSearchParams(stringified);
		return `/video/create?${urlParams}`;
	}
	static Logout(returnTo = "/") {
		return `/api/auth/logout?returnTo=${returnTo}`;
	}
}
export default Routes;
