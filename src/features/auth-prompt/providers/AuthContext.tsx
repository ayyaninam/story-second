import React, { createContext, useContext, ReactNode } from "react";
import { mainSchema } from "@/api/schema";
import { UserProfile, useUser } from "@auth0/nextjs-auth0/client";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/lib/queryKeys";
import api from "@/api";

type AuthContextType = {
	user?: UserProfile;
	data?: mainSchema["UserInfoDTOApiResponse"];
	isUserLoading: boolean;
	refetchUserData: () => Promise<void>;
};

interface AuthProviderProps {
	children: ReactNode;
}

const initialContext: AuthContextType = {
	refetchUserData: async () => {},
	isUserLoading: true,
};

const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const { user, isLoading } = useUser();

	const { data, refetch, isPending } = useQuery({
		queryKey: [QueryKeys.USER],
		queryFn: () => api.user.get(),
		enabled: !!user && !isLoading,
		staleTime: 3000,
	});

	const refetchUserData = async () => {
		await refetch();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				data,
				isUserLoading: isLoading || isPending,
				refetchUserData,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
