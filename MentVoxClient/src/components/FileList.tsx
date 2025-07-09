// src/components/FileList.tsx

// import FileItem from './FileItem'

interface FileListProps {
  files: string[];
}

const FileList = ({ files }: FileListProps) => {
  return (
    <div>
      <h2>Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {/* {files.map((file) => (
            // <FileItem fileName={file} />
          ))} */}
        </ul>
      )}
    </div>
  );
};

export default FileList;
