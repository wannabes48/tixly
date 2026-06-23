import { PostHog } from 'posthog-node';

let posthog: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!posthog) {
    posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthog;
}
