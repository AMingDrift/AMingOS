import { Button } from '@/_components/shadcn/ui/button';
import { Reply } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';

const PostItemPage: FC = () => {
    return (
        <Button className="ml-3" variant={'outline'} size="icon" asChild>
            <Link href="/blog">
                <Reply />
            </Link>
        </Button>
    );
};

export default PostItemPage;
