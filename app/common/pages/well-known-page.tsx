export default function WellKnownPage() {
  // This route exists to prevent runtime errors when tools (like Chrome DevTools)
  // request "/.well-known/..." paths while running the dev server.
  // We intentionally render nothing and let the router return a 200 response.
  return null;
}
