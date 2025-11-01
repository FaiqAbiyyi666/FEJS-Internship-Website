export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
          onClick={onClose}
        >
          &times;
        </button>

        {children}
      </div>
    </div>
  );
}
