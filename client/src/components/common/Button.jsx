export default function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium bg-blue-600 text-white disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
