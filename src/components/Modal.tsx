import { JSX } from "solid-js";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: JSX.Element | JSX.Element[];
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-10/12 shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg p-2 ml-auto inline-flex items-center"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm2-9H8v2h4V9z" clip-rule="evenodd"></path>
            </svg>
          </button>

        </div>
        <div class="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}