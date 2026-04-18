export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-lg'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h3 className='font-semibold'>{title}</h3>
          <button onClick={onClose}>?</button>
        </div>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  );
}
