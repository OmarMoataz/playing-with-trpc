import { useState } from 'react';

interface CommentProps {
  onSubmit: (text: string) => void;
}

const AddComment = ({ onSubmit }: CommentProps) => {
  const [text, setText] = useState<string>('');

  const handleChange = (value: string) => {
    setText(value);
  };

  return (
    <>
      <textarea onChange={(e) => handleChange(e.target.value)} value={text} />
      <button
        onClick={() => {
          onSubmit(text);
          setText('');
        }}
      >
        Add Comment
      </button>
    </>
  );
};

export default AddComment;
