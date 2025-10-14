import '../css/app.css';
import './bootstrap';

import { createLaravextApp } from '@laravext/react';
import { resolveComponent } from '@laravext/react/tools';
import i18n from 'i18next';
import Cookies from 'js-cookie';
import moment from 'moment/min/moment-with-locales';
import { initReactI18next } from 'react-i18next';
import { route as routeFn } from 'ziggy-js';
import es from './../../lang/es.json';
import en from './../../lang/en.json';
import pt from './../../lang/pt.json';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from './components/ui/sonner';
import { DialogProvider } from './providers/dialog-provider';

declare global {
    const route: typeof routeFn;
}

const languageDefaults: { [key: string]: { app_name: string } } = {
    pt: { app_name: 'Laravel App' },
    es: { app_name: 'Laravel App' },
    en: { app_name: 'Laravel App' },
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
document.addEventListener('DOMContentLoaded', function () {
    createLaravextApp({
        nexusResolver: (name: string) => resolveComponent(`./nexus/${name}`, import.meta.glob('./nexus/**/*')),

        beforeSetup: ({ laravext }: any) => {
            const user = laravext.page_data.shared_props?.auth.user;

            let fallbackLng = 'pt';
            let defaultLanguage = 'pt';

            // This is just for example purposes, using i18n/moment is not a requirement
            i18n.use(initReactI18next).init({
                resources: {
                    pt: {
                        translation: pt,
                    },
                    es: {
                        translation: es,
                    },
                    en: {
                        translation: en,
                    },
                },
                fallbackLng: fallbackLng,
                interpolation: {
                    defaultVariables: languageDefaults[fallbackLng], // Set initial defaults
                    escapeValue: false,
                },
            });

            let locale = user?.locale ?? Cookies.get('locale') ?? defaultLanguage;

            i18n.changeLanguage(locale);

            i18n.on('languageChanged', (lng) => {
                i18n.services.interpolator.init({
                    defaultVariables: languageDefaults[lng],
                });
            });

            moment.locale(locale);
        },

        setup: ({ component, laravext }: any) => {
            return <DialogProvider>
                {component}
                <Toaster richColors />
            </DialogProvider>
        },

        progress: {
            color: '#4B5563',
        },
    });

    // This will set light / dark mode on load...
    initializeTheme();
});
