import type { OAuthProvider } from './useOAuthCallback';

interface CallbackSpinnerProps {
  provider: OAuthProvider;
  status: string;
}

export function CallbackSpinner({ provider, status }: CallbackSpinnerProps) {
  const spinnerColor =
    provider === 'google' ? 'border-red-600' : 'border-blue-600';

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div
          className={`mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 ${spinnerColor}`}
        />
        <p className="text-lg font-medium">{status}</p>
        <p className="mt-2 text-sm text-gray-600">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}
