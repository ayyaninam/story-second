class Routes {
	static ViewStory(genre: string, id: string) {
		return `/video/${genre}/${id}/view`;
	}
	static EditStory(genre: string, id: string) {
		return `/video/${genre}/${id}/edit`;
	}
}
export default Routes;
