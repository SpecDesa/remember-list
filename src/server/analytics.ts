import "server-only"
import { PostHog } from 'posthog-node'

function serverSideAnalytics() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0
  })
  return posthogClient;
}


const analyticsServerClient = serverSideAnalytics();


// Use by importing and do analyticsServerClient.capture({
// distintId: user.userId,
// event: "delete image"
// properties: {
//  taskId: id,
// }
// })
export default analyticsServerClient;