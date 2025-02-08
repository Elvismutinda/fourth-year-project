import React from "react";

type Props = { fileUrl: string };

const PDFViewer = ({ fileUrl }: Props) => {
  return (
    <iframe
      src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
      className="w-full h-full"
    ></iframe>
  );
};

export default PDFViewer;
