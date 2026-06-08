"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };

  const bgColors = {
    success: "bg-green-50 dark:bg-green-950",
    error: "bg-red-50 dark:bg-red-950",
    info: "bg-blue-50 dark:bg-blue-950",
  };

  const borderColors = {
    success: "border-green-200 dark:border-green-800",
    error: "border-red-200 dark:border-red-800",
    info: "border-blue-200 dark:border-blue-800",
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColors[type]} border ${borderColors[type]} rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-right duration-300`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

let toastCount = 0;

export function showToast(message: string, type: ToastType = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const id = toastCount++;
  const toastElement = document.createElement("div");
  toastElement.id = `toast-${id}`;
  container.appendChild(toastElement);

  // This is a simple implementation - in a real app, you'd use a proper state management system
  // For now, we'll use a timeout to remove the toast
  setTimeout(() => {
    toastElement.remove();
  }, 3000);
}
