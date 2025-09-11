'use client';

import { toast } from 'sonner';

import { Button } from '@/_components/shadcn/ui/button';

export default function SonnerDemo() {
    return (
        <Button
            variant="ghost"
            className="mt-2 ml-2"
            onClick={() =>
                toast('Event has been created', {
                    description: 'Sunday, December 03, 2023 at 9:00 AM',
                    action: {
                        label: 'Undo',
                        onClick: () => console.log('Undo'),
                    },
                })
            }
        >
            Show Toast
        </Button>
    );
}
