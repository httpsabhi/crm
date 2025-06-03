"use client";
import React, { useState, useCallback } from "react";
import {
  FiPlus,
  FiTrash2,
  FiUsers,
  FiEye,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";
import api from "@/app/lib/axios";
import { FaRupeeSign } from "react-icons/fa";
import SaveSegment from "./SaveSegment";

type Rule = {
  field: "totalSpend" | "visits" | "inactiveDays";
  operator: ">" | "<" | "==" | ">=" | "<=";
  value: string;
};

type LogicOperator = "AND" | "OR";

const defaultRule = (): Rule => ({
  field: "totalSpend",
  operator: ">",
  value: "",
});

const fieldIcons = {
  totalSpend: <FaRupeeSign className="text-indigo-500" />,
  visits: <FiActivity className="text-indigo-500" />,
  inactiveDays: <FiCalendar className="text-indigo-500" />,
};

const RuleRow = ({
  rule,
  onChange,
  onDelete,
  showDelete,
}: {
  rule: Rule;
  onChange: (key: keyof Rule, value: string) => void;
  onDelete: () => void;
  showDelete: boolean;
}) => (
  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex items-center gap-2 w-full sm:w-auto">
      {fieldIcons[rule.field]}
      <select
        value={rule.field}
        onChange={(e) => onChange("field", e.target.value as Rule["field"])}
        className="border dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg w-full"
      >
        <option value="totalSpend">Total Spend</option>
        <option value="visits">Number of Visits</option>
        <option value="inactiveDays">Days Inactive</option>
      </select>
    </div>

    <select
      value={rule.operator}
      onChange={(e) => onChange("operator", e.target.value as Rule["operator"])}
      className="border dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg"
    >
      <option value=">">{">"}</option>
      <option value="<">{"<"}</option>
      <option value="==">{"="}</option>
      <option value=">=">{">="}</option>
      <option value="<=">{"<="}</option>
    </select>

    <input
      type="number"
      value={rule.value}
      onChange={(e) => onChange("value", e.target.value)}
      className="border dark:bg-gray-700 dark:text-white px-3 py-2 rounded-lg w-24"
      placeholder="Value"
      min="0"
    />

    {showDelete && (
      <button
        onClick={onDelete}
        className="text-red-500 flex items-center gap-1 text-sm"
      >
        <FiTrash2 className="w-4 h-4" />
        <span className="hidden sm:inline">Remove</span>
      </button>
    )}
  </div>
);

const CampaignRuleBuilder = () => {
  const [rules, setRules] = useState<Rule[]>([defaultRule()]);
  const [logicOperator, setLogicOperator] = useState<LogicOperator>("AND");
  const [audiencePreview, setAudiencePreview] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateRule = useCallback(
    (index: number, key: keyof Rule, value: string) => {
      setRules((prev) =>
        prev.map((r, i) => (i === index ? { ...r, [key]: value } : r))
      );
    },
    []
  );

  const addRule = () => setRules((prev) => [...prev, defaultRule()]);

  const deleteRule = (index: number) => {
    if (rules.length > 1) {
      setRules((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const previewAudience = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/campaigns/preview", {
        rules,
        logic: logicOperator,
      });

      setAudiencePreview(response.data.count);
    } catch (err) {
      console.error("Failed to fetch audience preview", err);
      setAudiencePreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || rules.some((r) => !r.value);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
          <FiUsers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audience Rule Builder
        </h2>
      </div>

      <div className="space-y-4 mb-6">
        {rules.map((rule, index) => (
          <RuleRow
            key={index}
            rule={rule}
            onChange={(key, val) => updateRule(index, key, val)}
            onDelete={() => deleteRule(index)}
            showDelete={rules.length > 1}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={addRule}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="w-4 h-4" /> Add Rule
        </button>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-700 dark:text-gray-300">Match</span>
          <select
            value={logicOperator}
            onChange={(e) => setLogicOperator(e.target.value as LogicOperator)}
            className="border dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg"
          >
            <option value="AND">All rules (AND)</option>
            <option value="OR">Any rule (OR)</option>
          </select>
        </div>
      </div>

      <button
        onClick={previewAudience}
        disabled={isDisabled}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium ${
          isDisabled
            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
              />
            </svg>
            Calculating...
          </>
        ) : (
          <>
            <FiEye className="w-4 h-4" /> Preview Audience Size
          </>
        )}
      </button>

      {audiencePreview !== null && (
        <>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-1">
              Audience Preview
            </h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {audiencePreview.toLocaleString()} customers
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              This campaign will target customers who match{" "}
              {logicOperator === "AND" ? "all" : "any"} of your rules.
            </p>
          </div>

          <SaveSegment
            rules={rules}
            logicOperator={logicOperator}
            audiencePreview={audiencePreview}
          />
        </>
      )}
    </div>
  );
};

export default CampaignRuleBuilder;
