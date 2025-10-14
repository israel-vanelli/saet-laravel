import * as React from 'react';
import { Button, type ButtonProps } from './button';
import { LoaderCircle } from 'lucide-react';

export interface LoadingButtonProps extends ButtonProps {
    processing?: boolean;
    loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({ processing, loading, children, ...props }, ref) => {
        return (
            <Button ref={ref} disabled={processing || loading} {...props}>
                {(processing || loading) && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                {children}
            </Button>
        );
    },
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };