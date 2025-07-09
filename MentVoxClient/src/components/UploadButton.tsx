// src/components/UploadButton.tsx

interface UploadButtonProps {
  onUpload: (fileName: string) => void;
}

const UploadButton = ({ onUpload }: UploadButtonProps) => {
  const handleUpload = () => {
    const newFile = prompt("Enter file name:"); // סימולציה להעלאה
    if (newFile) onUpload(newFile);
  };

  return <button onClick={handleUpload}>Upload File</button>;
};

export default UploadButton;
