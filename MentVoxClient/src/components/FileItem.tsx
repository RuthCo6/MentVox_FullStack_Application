// src/components/FileItem.tsx

interface FileItemProps {
  fileName: string;
}

const FileItem = ({ fileName }: FileItemProps) => {
  return <li>{fileName}</li>;
}
export default FileItem;
