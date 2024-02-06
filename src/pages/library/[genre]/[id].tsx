import Story from "@/features/story";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";

export default function StoryPage() {
	return <Story />;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
	return withPageAuthRequired()(ctx);
};
