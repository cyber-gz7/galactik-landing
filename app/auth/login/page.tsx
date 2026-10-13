import AuthForm from '@/components/AuthForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#00f0ff] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a Galactic Live</span>
        </Link>
      </div>

      <AuthForm mode="login" />
    </div>
  );
}
