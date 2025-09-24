import FileUploader from '../components/FileUploader';

export default function UploadPage() {
    return <FileUploader type="music" className="ml-3" maxSizeMB={1} />;
}
