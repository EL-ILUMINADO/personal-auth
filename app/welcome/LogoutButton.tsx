'use client';

import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { logoutUser } from '../../actions/auth';

export default function LogoutButton() {
  return (
    <form action={logoutUser}>
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-border-muted text-muted text-sm font-medium transition-colors hover:border-error hover:bg-error-subtle hover:text-error"
      >
        <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
        Log Out
      </button>
    </form>
  );
}
