import React, { ReactNode, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "../ui/button/Button";

interface ConfirmModalProps {
  title: string;
  description?: string;
  labelYes?: string;
  labelNo?: string;
  onYes?: () => void;
  onNo?: () => void;
  buttonClass?: string;
  buttonChild?: ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "",
  description = "",
  labelYes = "Yes",
  labelNo = "No",
  onYes,
  onNo,
  buttonClass,
  buttonChild,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleYes = () => {
    onYes?.();
    setIsOpen(false);
  };

  const handleNo = () => {
    onNo?.();
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <button
        onClick={() => setIsOpen(true)}
        className={
          buttonClass ??
          "px-4 py-2 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700"
        }
      >
        {buttonChild ?? "Open Modal"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-xl animate-in slide-in-from-bottom-5 duration-700">
            <div className="bg-brand-600 py-3 px-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white/30">
                  <AlertTriangle size={22} />
                </div>

                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
            </div>

            <div className="px-6 py-5">
              {description && (
                <p className="text-md leading-relaxed text-gray-800">
                  {description}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  onClick={() => handleNo()}
                  variant="outline"
                  className="px-5 py-2.5 text-sm font-medium"
                >
                  {labelNo}
                </Button>

                <Button
                  onClick={() => handleYes()}
                  variant="primary"
                  className="px-5 py-2.5 text-sm font-mediu"
                >
                  {labelYes}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmModal;
