

export default function NotFound(){
    return (
        <div className="flex h-screen flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-600"> The page you’re looking for doesn’t exist or has been moved. </p>
        <a href="/" className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"> Go Home </a>
      </div>
    );
}