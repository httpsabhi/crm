"use client";
import React, { useState } from "react";
import { FiSave, FiCheck, FiAlertCircle } from "react-icons/fi";
import api from "@/app/lib/axios";
import Button from "@/components/Button"; // Import your existing Button component
import { useRouter } from "next/navigation";

type Rule = {
  field: "totalSpend" | "visits" | "inactiveDays";
  operator: ">" | "<" | "==" | ">=" | "<=";
  value: string;
};

type LogicOperator = "AND" | "OR";

type SaveSegmentProps = {
  rules: Rule[];
  logicOperator: LogicOperator;
  audiencePreview: number | null;
};

const SaveSegment = ({
  rules,
  logicOperator,
  audiencePreview,
}: SaveSegmentProps) => {
  const router = useRouter();
  const [segmentName, setSegmentName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [templateMessage, setTemplateMessage] = useState("");

  const saveSegment = async () => {
    if (!segmentName.trim()) {
      setMessage({ type: "error", text: "Please enter a segment name" });
      return;
    }

    if (rules.some((r) => !r.value)) {
      setMessage({ type: "error", text: "Please complete all rule values" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await api.post("/campaigns", {
        segmentName,
        rules,
        logic: logicOperator,
        audienceCount: audiencePreview,
        message: templateMessage,
      });

      if (response.status === 200) {
        setMessage({ type: "success", text: "Segment saved successfully!" });
        setSegmentName("");
        router.replace("/campaigns");
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error: unknown) {
      let errorText = "Failed to save segment. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
      ) {
        errorText = (error as { response: { data: { message: string } } }).response.data.message;
      }

      setMessage({ type: "error", text: errorText });
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = isSaving || !segmentName || rules.some((r) => !r.value);

  return (
    <div className="mt-6 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
          <FiSave className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Save Customer Segment
        </h3>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Segment Name
        </label>
        <input
          type="text"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., High Value Customers"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message Template
        </label>
        <textarea
          rows={4}
          value={templateMessage}
          onChange={(e) => setTemplateMessage(e.target.value)}
          placeholder="e.g., Hello {{name}}, thank you for spending ₹{{totalSpend}} with us!"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Use variables like{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">
            {`{{name}}`}
          </code>
          , <code>{`{{email}}`}</code>, <code>{`{{totalSpend}}`}</code>, etc.
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This segment will target{" "}
          <span className="font-medium">
            {audiencePreview?.toLocaleString() || 0}
          </span>{" "}
          customers matching {logicOperator === "AND" ? "all" : "any"} of your
          rules.
        </p>
      </div>

      <Button
        onClick={saveSegment}
        variant="primary"
        isLoading={isSaving}
        disabled={isDisabled}
        fullWidth
        className="justify-center py-3"
      >
        <FiSave className="mr-2" />
        {isSaving ? "Saving..." : "Save Segment"}
      </Button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg flex items-start ${
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
          }`}
        >
          <span className="mr-3 mt-0.5">
            {message.type === "success" ? (
              <FiCheck className="text-green-500" />
            ) : (
              <FiAlertCircle className="text-red-500" />
            )}
          </span>
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default SaveSegment;
