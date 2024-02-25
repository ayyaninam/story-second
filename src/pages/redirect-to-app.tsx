import { GetServerSideProps } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import Routes from "@/routes";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res);
  const returnTo = session ? Routes.Library() : Routes.Explore();
  return {
    redirect: {
      destination: returnTo,
      permanent: false,
    },
  };
};

export default function Page() {
  return null;
}
