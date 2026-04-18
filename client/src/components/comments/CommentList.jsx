export default function CommentList({ comments = [] }) {
  if (!comments.length) return <p className='text-sm text-gray-500'>No comments yet.</p>;

  return (
    <div className='space-y-3'>
      {comments.map((comment) => (
        <div key={comment._id} className='rounded-lg border bg-white p-3'>
          <p className='text-sm text-gray-800'>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
