'use client';

import { Button } from '@/_components/shadcn/ui/button';
import React, { useState } from 'react';
import { toast } from 'sonner';
const page = () => {
    const [error, setError] = useState(false);

    if (error) {
        throw new Error('test error from render');
    }

    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={() => {
                    toast.success('test toast');
                }}
            >
                toast
            </Button>
            <Button
                onClick={() => {
                    setError(true);
                }}
            >
                throw error
            </Button>
        </div>
    );
};

export default page;
