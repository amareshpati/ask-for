import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/invitations/[slug]/public (public invitation API)
     * - api/invitations/[slug]/respond (public response API)
     * - invite (public invitation pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|invite|api/invitations/[^/]+/public|api/invitations/[^/]+/respond|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
