import { AdminChecker } from '@/_components/auth';
import FileUploader from '../components/FileUploader';

export default function UploadPage() {
    return (
        <AdminChecker>
            <FileUploader type="videos" className="ml-3" maxSizeMB={5} />
        </AdminChecker>
    );
}
