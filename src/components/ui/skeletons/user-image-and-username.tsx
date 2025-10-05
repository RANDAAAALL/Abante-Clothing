export default function UserImageAndUsernameSkeleton(){
    return (
        <div className="flex flex-col items-center">
        <div className="user-image-skeleton w-[110px] h-[100px] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="username-skeleton h-5 mt-4.5 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
    );
}