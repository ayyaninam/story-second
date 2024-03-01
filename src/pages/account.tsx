

import {GetServerSidePropsContext, InferGetServerSidePropsType} from "next";
import {getSession} from "@auth0/nextjs-auth0";
import {AuthError} from "@/utils/auth";
import Routes from "@/routes";
import React, {ReactElement} from "react";
import PageLayout from "@/components/layouts/PageLayout";
import AccountsPage from "@/features/account";


export default function ProfilePage({ accessToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AccountsPage accessToken={accessToken} />
		</>
	);
}
ProfilePage.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={4}>{page}</PageLayout>;
};


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	try {
		const session = await getSession(ctx.req, ctx.res);
		if (!session || !session.accessToken) {
			return {
				redirect: {
					destination: Routes.authpage + "?returnTo=/profile",
					permanent: false,
				},
			};
		}

		return { props: { accessToken: session.accessToken } };
	} catch (e) {
		if (e instanceof AuthError) {
			return {
				redirect: {
					destination: e.redirect,
					permanent: false,
				},
			};
		}
		return {
			redirect: {
				destination: Routes.defaultRedirect,
				permanent: false,
			},
		};
	}
};