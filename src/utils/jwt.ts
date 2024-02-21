import isBrowser from "./isBrowser";

export const setJwt = (token: string | null) => {
	if (isBrowser) window.localStorage.setItem("jwt", token ?? "");
};
export const removeJwt = () => {
	if (isBrowser) window.localStorage.removeItem("jwt");
};

export const getJwt = () => {
	if (isBrowser) return window.localStorage.getItem("jwt") ?? "";
	throw new Error("Error fetching jwt: fetched browser JWT in the server");
};
