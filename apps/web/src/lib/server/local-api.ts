/** Build-time local routing only. Production routing belongs to the deployment proxy. */
export function localApiRewrites(origin: string | undefined) {
  if (origin === undefined) return [];
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    throw new Error('GDTUTOR_LOCAL_API_ORIGIN must be a loopback HTTP origin.');
  }
  if (
    url.protocol !== 'http:' ||
    !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    origin.trim() !== origin ||
    /[\\\s]/.test(origin) ||
    !/^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(?::\d+)?\/?$/.test(origin)
  ) {
    throw new Error(
      'GDTUTOR_LOCAL_API_ORIGIN must be a loopback HTTP origin without credentials or a path.',
    );
  }
  return [
    { source: '/api/v1/:path*', destination: `${url.origin}/api/v1/:path*` },
    { source: '/health/live', destination: `${url.origin}/health/live` },
    { source: '/health/ready', destination: `${url.origin}/health/ready` },
  ];
}
