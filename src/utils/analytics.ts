import {useUser} from "@auth0/nextjs-auth0/client";
import {event} from "nextjs-google-analytics";
import {env} from "@/env.mjs";


export type AnalyticsEvent =
  | "create_story"
  | "create_video"
  | "test_onclick";

const useLogEvent = () => {
  const {user} = useUser();

  return (action: AnalyticsEvent, variables?: { [key: string]: any }) => {
    const userType = user ? "registered" : "unregistered";
    if (action.length >= 40) console.error("Analytics event name too long: ", action);
    if (env.NEXT_PUBLIC_VERCEL_ENVIRONMENT !== "production") return;
    if (typeof window === "undefined") return;
    return event(action, {userType, ...variables});
  };
}

export default useLogEvent;
