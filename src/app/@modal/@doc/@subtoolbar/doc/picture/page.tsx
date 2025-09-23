'use client';

import { UploadCloudIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/_components/shadcn/ui/button';
import { Input } from '@/_components/shadcn/ui/input';

import { uploadDoc } from '../../../actions';

export default function AvatarUploadPage() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        const file = event.target.files[0];

        await uploadDoc({
            prefix: 'picture/',
            file,
        });

        toast.success('Uploaded picture successfully!');
        router.refresh();

        event.target.value = '';
    };

    const handleButtonClick = () => {
        inputFileRef.current?.click();
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
            {/* TODO: 设置upload按钮的pedding状态 */}
            <Button variant={'outline'} size="lg" className="ml-4.5" onClick={handleButtonClick}>
                <UploadCloudIcon size={16} className="w-4!" />
                Upload
            </Button>
        </>
    );
}
