import { useState } from 'react';

export default function CommentInput({ onSubmit, loading = false }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Write a comment...'
        rows={3}
        className='w-full border rounded-lg px-3 py-2'
      />
      <button disabled={loading} className='px-4 py-2 rounded bg-blue-600 text-white'>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}
