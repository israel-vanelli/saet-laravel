import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import LanguageToggleDropdown from '@/components/language-dropdown';

export default function DeskLayout({ children }) {
    return (
        <div className="relative">
            {/* Theme toggle in the top right corner */}
            <div className="absolute top-4 flex space-x-2 right-4 z-10">
                <AppearanceToggleDropdown />
                {/* <LanguageToggleDropdown /> */}
            </div>
            <div className="flex flex-col lg-custom:flex-row h-screen px-5 sm:px-0">
                <div className="hidden lg-custom:block w-1/2 bg-gray-200">
                    <img
                        src="/images/pages/login/desk.jpeg"
                        alt="Empreender"
                        className="h-full w-auto object-cover"
                    />
                </div>
                <div className="w-full lg-custom:w-1/2 bg-background flex items-center justify-center h-full lg-custom:h-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}