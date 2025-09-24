import FileUploader from '../components/FileUploader';

export default function UploadPage() {
    return <FileUploader type="video" className="ml-3" maxSizeMB={5} />;
}
