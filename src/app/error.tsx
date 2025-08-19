"use client"

export default function Error({error, reset}: {error: Error; reset: () => void}) {
    return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">⚠️ Oops! Something went wrong.</h1>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
       onClick={() => reset()}
       className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Try again
      </button>
    </div>
    );
}