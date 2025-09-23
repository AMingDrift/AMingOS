'use client';

import type { PutBlobResult } from '@vercel/blob';

import { upload } from '@vercel/blob/client';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/_components/shadcn/ui/button';
import { Input } from '@/_components/shadcn/ui/input';
import { appConfig } from '@/config/app';
import { docPath } from '@/server/doc/routes';

export default function AvatarUploadPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
    return (
        <>
            <form
                className="flex gap-2"
                onSubmit={async (event) => {
                    event.preventDefault();

                    if (!inputFileRef.current?.files) {
                        throw new Error('No file selected');
                    }

                    const file = inputFileRef.current.files[0];

                    const newBlob = await upload(`picture/${file.name}`, file, {
                        access: 'public',
                        handleUploadUrl: `${appConfig.baseUrl}${appConfig.apiPath}${docPath}/upload`,
                    });

                    toast.success('Uploaded picture successfully!');
                }}
            >
                <Input name="file" ref={inputFileRef} type="file" required className="max-w-40" />
                <Button type="submit">Upload</Button>
            </form>
        </>
    );
}
