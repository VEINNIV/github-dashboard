import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 bg-red-50 dark:bg-rose-950/40 rounded-2xl border border-red-100 dark:border-rose-800/50 max-w-2xl mx-auto mt-8">
      <AlertCircle className="w-12 h-12 text-red-500 dark:text-rose-400 mb-3" />
      <h3 className="text-lg font-semibold text-red-800 dark:text-rose-300 mb-1">
        Oops! Something went wrong
      </h3>
      <p className="text-red-600 dark:text-rose-400 text-sm">{message}</p>
    </div>
  );
}
