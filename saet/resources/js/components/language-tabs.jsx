import { cn } from '@/lib/utils';
import { sharedProps } from '@laravext/react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

export default function AppearanceToggleTab({ className = '', ...props }) {
    const { t, i18n } = useTranslation();
    const { user } = sharedProps().auth;

    const tabs = {
        pt: {
            locale: 'pt',
            name: 'Português',
            flag: '/images/flags/br.svg',
        },
        en: {
            locale: 'en',
            name: 'English',
            flag: '/images/flags/us.svg',
        },
        // es: {
        //     locale: 'es',
        //     name: 'Español',
        //     flag: '/images/flags/mx.svg',
        // },
    };

    const getLanguageIcon = (locale) => {
        return <img src={tabs[locale]?.flag} alt={tabs[locale]?.locale} className="h-5 w-5" />;
    };

    const handleLocaleChange = (locale) => {
        i18n.changeLanguage(locale);

        Cookies.set('locale', locale);

        if (user) {
            axios.post('/api/auth/user', {
                locale,
            });
        }
    };

    return (
        <div className={cn('inline-flex gap-2 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
            {Object.values(tabs).map(({ locale, flag, name }) => (
                <button
                    key={locale}
                    onClick={() => handleLocaleChange(locale)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        locale === i18n.language
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    {getLanguageIcon(locale)}
                    <span className="ml-1.5 text-sm">{name}</span>
                </button>
            ))}
        </div>
    );
}
