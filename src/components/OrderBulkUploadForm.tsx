import React, { useState } from "react";
import FileUpload from "./FileUpload";
import api from "@/app/lib/axios";

export default function OrderBulkUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setStatus({ type: "error", message: "Please select a file to upload" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setStatus({ type: "info", message: "Uploading your file..." });

    try {
      const res = await api.post("/orders/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      setStatus({
        type: "success",
        message: `Success! ${res.data.count} orders added successfully.`,
      });
      setFile(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setStatus({
        type: "error",
        message: error.response?.data?.error || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <FileUpload
        acceptedFormats={["application/json", "text/csv"]}
        maxFileSize={10 * 1024 * 1024} // 10 MB limit
        value={file}
        onChange={setFile}
        disabled={uploading}
        error={status?.type === "error" ? status.message : null}
        showProgress={uploading}
        progress={progress}
        statusMessage={status?.message}
        statusType={status?.type}
      />

      <button
        type="submit"
        disabled={!file || uploading}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
