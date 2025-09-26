'use client';

import { UploadCloudIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/_components/shadcn/ui/button';
import { Input } from '@/_components/shadcn/ui/input';
import { uploadStorage } from '@/app/@modal/@storage/actions';

interface FileUploaderProps {
    type: 'images' | 'videos';
    className?: string;
    maxSizeMB?: number;
}

const mimeTypes: Record<FileUploaderProps['type'], string> = {
    images: 'image/*',
    videos: 'video/*',
};

export default function FileUploader({ type, className = '', maxSizeMB = 1 }: FileUploaderProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    // 根据类型设置文件接受类型和上传路径前缀
    const accept = mimeTypes[type];
    const prefix = `${type}/`;
    const successMessage = `Uploaded ${type} successfully!`;
    const errorMessage = `Failed to upload ${type}.`;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        const file = event.target.files[0];

        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.size > maxSizeBytes) {
            toast.error(
                `${type.charAt(0).toUpperCase() + type.slice(1)} file size cannot exceed ${maxSizeMB}MB.`,
            );
            event.target.value = '';
            return;
        }

        try {
            setIsLoading(true);

            await uploadStorage(
                {
                    prefix,
                    file,
                },
                pathname,
            );

            toast.success(successMessage);
            router.refresh();
        } catch {
            toast.error(errorMessage);
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
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />
            <Button
                variant={'outline'}
                size="lg"
                className={className}
                onClick={handleButtonClick}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent duration-500" />
                ) : (
                    <UploadCloudIcon className="h-4 w-4!" />
                )}
                Upload
            </Button>
        </>
    );
}
