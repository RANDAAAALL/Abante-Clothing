

export default function EmailAndUsernameSkeleton(){
    return (
        <div className="space-y-5 font-medium">
        <div className="grid grid-cols-[1fr_1fr]"><span className="username-skeleton h-6 w-25"></span><span className="username-skeleton h-5 w-45"></span></div>
        <div className="grid grid-cols-[1fr_1fr]"><span className="username-skeleton h-6 w-25"></span><span className="username-skeleton h-5 w-45"></span></div>
        </div>
    );
}