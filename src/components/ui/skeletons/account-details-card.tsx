export default function AccountDetailsSkeleton() {
    return (
      <div className="space-y-5 font-medium -mt-4">
        {/* Header + Edit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <span className="username-skeleton h-7 w-45"></span>
          <div className="flex mt-1 sm:mt-0 items-center space-x-2">
          <span className="username-skeleton h-8 w-16 rounded-md"></span>
          <span className="username-skeleton h-8 w-37 rounded-md"></span>
          </div>
        </div>
  
        {/* Email Row */}
        <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
          <span className="username-skeleton h-5 w-20"></span>
          <span className="username-skeleton h-5 w-50"></span>
        </div>
  
        {/* Username Row */}
        <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
          <span className="username-skeleton h-5 w-24"></span>
          <span className="username-skeleton h-5 w-32"></span>
        </div>
      </div>
    );
  }
  