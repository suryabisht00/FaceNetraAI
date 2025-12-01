import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <div>Hello welcome to feed page</div>
    </ProtectedRoute>
  );
}