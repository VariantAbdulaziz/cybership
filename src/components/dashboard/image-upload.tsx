"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  imagePreview: string | null;
}

export function ImageUpload({ onImageUpload, imagePreview }: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
        isDragging ? "border-primary bg-primary/10" : "border-gray-300"
      }`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Preview"
          className="mx-auto max-h-40 object-contain"
        />
      ) : (
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Drag & drop an image here, or click to select one
          </p>
        </div>
      )}
    </div>
  );
}
