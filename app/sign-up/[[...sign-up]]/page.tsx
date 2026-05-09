import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-white">Clerk not configured</h1>
        <p className="text-slate-400">Add Clerk keys to enable sign up.</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}
