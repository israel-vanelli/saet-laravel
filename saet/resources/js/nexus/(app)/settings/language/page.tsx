import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head } from '@laravext/react';
import LanguageTabs from '@/components/language-tabs';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Language settings',
        href: '/settings/language',
    },
];

export default function Language() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Language settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Language settings" description="Update your account's language settings" />
                    <LanguageTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
