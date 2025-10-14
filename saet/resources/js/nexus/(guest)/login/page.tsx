import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, nexusProps, visit } from '@laravext/react';
import axios from 'axios';
import { useForm } from '@/hooks/use-form';
import { useTranslation } from 'react-i18next';
import useAuth from '@/hooks/use-auth';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login() {
    const { canResetPassword } = nexusProps();

    const {t} = useTranslation();
    const { refreshUser} = useAuth();

    const { data, setData, errors, setErrors, processing, setProcessing } = useForm({
        email: import.meta.env.VITE_APP_ENV == 'local' ? 'admin@utfpr.edu.br' : '',
        password: import.meta.env.VITE_APP_ENV == 'local' ? 'password' : '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setProcessing(true);

        axios.post('/api/login', data).then((response) => {
            refreshUser();
            visit('/settings/profile');
        }).catch((error) => {
            setErrors(error.response.data.errors);
        }).finally(() => {
            setProcessing(false);
        });
    };

    return (
        <AuthLayout title={t("Log in to your account")} description={t("Enter your email and password below to log in")}>
        
            <Head title={t("Log in")} />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("Email Address")}</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={t("email@example.com")}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">{t("Password")}</Label>
                            {canResetPassword && (
                                <TextLink href={route('forgot-password')} className="ml-auto text-sm" tabIndex={5}>
                                    {t("Forgot Your Password?")}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={t("Password")}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox id="remember" name="remember" tabIndex={3} />
                        <Label htmlFor="remember">{t("Remember me")}</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full" tabIndex={4} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {t("Log in")}
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    <Link href="/register" className="text-sm underline">
                        {t("Don't have an account?")}
                    </Link>
                </div>
            </form>
        
        </AuthLayout>
    );
}
