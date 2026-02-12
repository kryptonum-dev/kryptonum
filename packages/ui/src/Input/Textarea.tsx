import { forwardRef } from 'react';

const Textarea = forwardRef((props, ref) => {
  const handleExpand = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  };

  return (
    <textarea
      onInput={handleExpand}
      ref={ref as React.Ref<HTMLTextAreaElement>}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
