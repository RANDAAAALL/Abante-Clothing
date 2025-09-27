import TermsAndConditionsContent from "@/components/ui/terms-and-conditions-section/terms-and-conditions-content";

export const dynamic = 'force-static';

export default function TermsAndConditions(){
    return (
        <div className="bg-white dark:bg-black-background dark:text-white text-black min-h-screen w-full">
        <TermsAndConditionsContent />
        </div>
    );
}