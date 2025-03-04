"use client";

import { useMutation } from "@tanstack/react-query";
import { FileUp, Inbox, Loader } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "@/lib/cloudinary";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_url,
      file_name,
    }: {
      file_url: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_url,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast.error("Only PDF files are allowed");
        return;
      }

      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToCloudinary(file);
        console.log("Uploaded file: ", data);

        if (!data?.file_url || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/app/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.log("Error uploading file", error);
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div
      {...getRootProps({
        className:
          "border-dashed border border-[#363A3D] rounded-md cursor-pointer bg-[#1A1D21]/40 py-8 flex justify-center items-center flex-col gap-3",
      })}
    >
      <input {...getInputProps()} />
      {uploading || isPending ? (
        <>
          <Loader className="h-10 w-10 text-gray-500 animate-spin" />
          <p className="mt-2 text-sm text-slate-400">Processing your document...</p>
        </>
      ) : (
        <>
          <FileUp className="size-10 text-gray-500" />
          <p className="mt-2 text-slate-400">
            <span className="text-green-500">Click to upload </span>
            or drag & drop your PDF file here
          </p>
          <p className="text-slate-400 text-sm">
            Maximum PDF file size is 10MB
          </p>
        </>
      )}
    </div>
  );
};

export default FileUpload;
