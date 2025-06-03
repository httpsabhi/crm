"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  FiUpload,
  FiFile,
  FiX,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

type FileUploadProps = {
  acceptedFormats: string[];
  maxFileSize: number;
  value?: File | null; // controlled file input value
  onChange: (file: File | null) => void;
  disabled?: boolean;
  error?: string | null;
  showProgress?: boolean;
  progress?: number;
  statusMessage?: string;
  statusType?: "success" | "error" | "info" | null;
};

export default function FileUpload({
  acceptedFormats,
  maxFileSize,
  value,
  onChange,
  disabled = false,
  error = null,
  showProgress = false,
  progress = 0,
  statusMessage,
  statusType,
}: FileUploadProps) {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync controlled value with internal state
  useEffect(() => {
    setInternalFile(value ?? null);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      // Validate file size
      if (selectedFile.size > maxFileSize) {
        onChange(null);
        return;
      }
      // Validate file type
      if (!acceptedFormats.includes(selectedFile.type)) {
        onChange(null);
        return;
      }
    }

    setInternalFile(selectedFile);
    onChange(selectedFile);
  };

  const handleRemoveFile = () => {
    if (disabled) return;
    setInternalFile(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getStatusIcon = () => {
    switch (statusType) {
      case "success":
        return <FiUpload className="text-green-500" />;
      case "error":
        return <FiAlertCircle className="text-red-500" />;
      case "info":
        return <FiLoader className="animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer select-none transition-colors ${
          internalFile
            ? "border-indigo-300 bg-indigo-50/20 dark:bg-indigo-900/10"
            : "border-gray-300 hover:border-indigo-300 dark:border-gray-600 dark:hover:border-indigo-500"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => {
          if (!disabled) fileInputRef.current?.click();
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <FiUpload className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">
              {internalFile ? internalFile.name : "Drag & drop your file here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {internalFile
                ? "Click to change file"
                : "or click to browse files"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Supported formats: {acceptedFormats.map((ext) => ext.split("/").pop()).join(", ")} (Max{" "}
              {(maxFileSize / 1024 / 1024).toFixed(1)} MB)
            </p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Selected File Preview */}
      {internalFile && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-4">
          <div className="flex items-center space-x-3">
            <FiFile className="text-indigo-500 dark:text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {internalFile.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(internalFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
            disabled={disabled}
            aria-label="Remove file"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <FiAlertCircle />
          {error}
        </p>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className="mt-4 space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-right text-gray-500 dark:text-gray-400">
            {progress}% uploaded
          </p>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`flex items-start p-4 rounded-lg mt-4 ${
            statusType === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : statusType === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
              : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
          }`}
        >
          <span className="mr-3 mt-0.5">{getStatusIcon()}</span>
          <p className="text-sm">{statusMessage}</p>
        </div>
      )}
    </div>
  );
}
