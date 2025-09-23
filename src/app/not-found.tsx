"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ILLUSTRATION_SRC = "/meme.jpeg";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto mb-8 h-auto w-full max-w-md">
        <Image
          src={ILLUSTRATION_SRC}
          alt="We can't find this page"
          width={900}
          height={900}
          priority
          className="h-auto w-full select-none rounded-2xl"
        />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        We can’t find this page
      </h1>
      <p className="mx-auto mt-2 max-w-prose text-sm text-gray-600">
        The page you’re looking for may have been moved or doesn’t exist.
      </p>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.back()}
          className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-black/90"
          aria-label="Go back to previous page"
        >
          Go back
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Error code: <span className="font-mono">404</span>
      </p>
    </main>
  );
}
