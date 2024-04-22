import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import React, { ReactElement } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import AccountsPage from "@/features/account";

export default function ProfilePage() {
	return <AccountsPage />;
}
ProfilePage.getLayout = function getLayout(page: ReactElement) {
	return <PageLayout pageIndex={3}>{page}</PageLayout>;
};

export const getServerSideProps = withPageAuthRequired();
