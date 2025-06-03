"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/app/lib/axios";
import { toast } from "sonner";
import { FiPackage, FiUser, FiPlus, FiLoader } from "react-icons/fi";
import Button from "@/components/Button";
import { FaRupeeSign } from "react-icons/fa";
import OrderBulkUploadForm from "./OrderBulkUploadForm";

const formSchema = z.object({
  customer: z.string().min(1, "Please select a customer"),
  orderAmount: z
    .string()
    .min(1, "Order amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Please enter a valid amount",
    }),
  products: z
    .string()
    .min(1, "At least one product is required")
    .refine((val) => val.split(",").every((item) => item.trim() !== ""), {
      message: "Enter comma-separated product names",
    }),
});

type OrderFormData = z.infer<typeof formSchema>;

interface Customer {
  _id: string;
  name: string;
  email: string;
}

export default function OrderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [showProductExamples, setShowProductExamples] = useState(false);

  const productsValue = watch("products");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/customers");
        setCustomers(res.data);
      } catch (err: Error | unknown) {
        const error = err as Error;
        toast.error(
          "Failed to load customers: " +
            (error?.message || "Please try again later")
        );
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const onSubmit = async (data: OrderFormData) => {
    try {
      await api.post("/orders", {
        customer: data.customer,
        orderAmount: parseFloat(data.orderAmount),
        products: data.products.split(",").map((p) => p.trim()),
      });

      toast.success("Order created successfully!", {
        description: `${
          data.products.split(",").length
        } products added to order`,
      });
      reset();
    } catch (err: Error | unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      const msg = error?.response?.data?.error || "Failed to create order";
      toast.error("Order creation failed", {
        description: msg,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Form Header */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
              <FiPackage className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Create New Order
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Customer Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer
              </label>
              <div className="relative">
                {loadingCustomers ? (
                  <div className="flex items-center justify-center h-10 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <FiLoader className="animate-spin text-gray-500 mr-2" />
                    <span className="text-sm">Loading customers...</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register("customer")}
                      className="pl-10 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      disabled={loadingCustomers}
                    >
                      <option value="">Select a customer</option>
                      {customers.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.email})
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {errors.customer && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.customer.message}
                  </p>
                )}
              </div>
            </div>

            {/* Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRupeeSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("orderAmount")}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
                {errors.orderAmount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.orderAmount.message}
                  </p>
                )}
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Products
                </label>
                <button
                  type="button"
                  onClick={() => setShowProductExamples(!showProductExamples)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {showProductExamples ? "Hide examples" : "Show examples"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPackage className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("products")}
                  className="pl-10 w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Laptop, Mouse, Keyboard"
                />
              </div>
              {errors.products && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.products.message}
                </p>
              )}
              {showProductExamples && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <p>Enter product names separated by commas. Examples:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Smartphone, Case, Screen protector</li>
                    <li>Laptop, Mouse, Keyboard, Mouse pad</li>
                    <li>T-shirt, Jeans, Belt</li>
                  </ul>
                </div>
              )}
              {productsValue && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Products detected:{" "}
                    <span className="font-medium">
                      {productsValue.split(",").filter((p) => p.trim()).length}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting || !isValid}
                fullWidth
                className="justify-center py-3"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <FiPlus className="mr-2" />
                    Create Order
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <OrderBulkUploadForm />
    </div>
  );
}
