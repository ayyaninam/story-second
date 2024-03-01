import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";

import Routes from "@/routes";
import React, { ReactElement } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import AccountsPage from "@/features/account";

export default function ProfilePage({
	accessToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AccountsPage accessToken={accessToken} />
		</>
	);
}
ProfilePage.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={4}>{page}</PageLayout>;
};

const _getServerSideProps = async ({
	req,
	res,
	resolvedUrl,
}: GetServerSidePropsContext) => {
	try {
		const session = await getSession(req, res);
		if (session == null || session?.accessToken == null) {
			// if protected by withPageAuthRequired, this should never happen
			return {
				redirect: {
					destination: `${Routes.authpage}?returnTo=${resolvedUrl}`,
					permanent: false,
				},
			};
		}

		return { props: { accessToken: session.accessToken } };
	} catch (e) {
		return {
			redirect: {
				destination: Routes.defaultRedirect,
				permanent: false,
			},
		};
	}
};

export const getServerSideProps = withPageAuthRequired({
	getServerSideProps: _getServerSideProps,
});
