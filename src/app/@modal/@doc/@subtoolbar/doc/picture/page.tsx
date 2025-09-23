'use client';

import { UploadCloudIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/_components/shadcn/ui/button';
import { Input } from '@/_components/shadcn/ui/input';

import { uploadDoc } from '../../../actions';

export default function AvatarUploadPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        const file = event.target.files[0];

        try {
            setIsLoading(true);

            await uploadDoc({
                prefix: 'picture/',
                file,
            });

            toast.success('Uploaded picture successfully!');
            router.refresh();
        } catch (error) {
            toast.error('Failed to upload picture.');
        } finally {
            setIsLoading(false);
            event.target.value = '';
        }
    };

    const handleButtonClick = () => {
        if (!isLoading) {
            inputFileRef.current?.click();
        }
    };

    return (
        <>
            <Input
                name="file"
                ref={inputFileRef}
                type="file"
                required
                className="hidden"
                onChange={handleFileChange}
            />
            <Button
                variant={'outline'}
                size="lg"
                className="ml-4.5"
                onClick={handleButtonClick}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin duration-500" />
                ) : (
                    <UploadCloudIcon className="w-4! h-4" />
                )}
                Upload
            </Button>
        </>
    );
}
