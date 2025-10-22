import { AdminChecker } from '@/_components/auth';
import FileUploader from '../components/FileUploader';

export default function UploadPage() {
    return (
        <AdminChecker>
            <FileUploader type="images" className="ml-3" maxSizeMB={1} />
        </AdminChecker>
    );
}
