import { GetServerSidePropsContext } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import Routes from "@/routes";

/**
 * Temporary `getServerSideProps()` that passes accessToken to the page.
 */
export const getServerSidePropsStub = async ({
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
