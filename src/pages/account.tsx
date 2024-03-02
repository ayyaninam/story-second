import { InferGetServerSidePropsType } from "next";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import React, { ReactElement } from "react";
import PageLayout from "@/components/layouts/PageLayout";
import AccountsPage from "@/features/account";
import { getServerSidePropsStub } from "@/utils/getServerSidePropsStub";

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

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: getServerSidePropsStub,
});
