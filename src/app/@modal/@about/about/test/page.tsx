'use client';

import { Button } from '@/_components/shadcn/ui/button';
import React from 'react';
import { toast } from 'sonner';
const page = () => {
    return (
        <>
            <Button
                onClick={() => {
                    toast.success('test toast');
                }}
            >
                toast
            </Button>
        </>
    );
};

export default page;
