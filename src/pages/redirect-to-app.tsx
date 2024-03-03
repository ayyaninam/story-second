import { GetServerSideProps } from "next";
import Routes from "@/routes";


export const getServerSideProps: GetServerSideProps = async () => {
  const returnTo = Routes.Feed();
  return {
    redirect: {
      destination: returnTo,
      permanent: false,
    },
  };
};

// Disabled: just redirect to /feed
// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx.req, ctx.res);
//   const returnTo = session ? Routes.Library() : Routes.Feed();
//   return {
//     redirect: {
//       destination: returnTo,
//       permanent: false,
//     },
//   };
// };

export default function Page() {
  return null;
}
