import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const GlobalModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-1/3 rounded-md bg-white p-6">
        <button onClick={onClose} className="absolute right-2 top-2 text-gray-500">
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default GlobalModal;
