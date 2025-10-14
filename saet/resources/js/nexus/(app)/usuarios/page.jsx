import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@laravext/react';
import Table from '@/components/pagination/table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs = [
    {
        title: 'Usuários',
        href: '/usuarios',
    },
];

export default function Dashboard() {

    const [params, setParams] = useState({});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuários" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Table endpoint={'/api/users'} params={{}} />
            </div>
            
        </AppLayout>
    );
}
