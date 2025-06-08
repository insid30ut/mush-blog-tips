import React, { useRef, useEffect } from 'react';

const Editor = ({ value, onChange, placeholder = 'Write your content here...' }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e) => {
    const content = e.currentTarget.innerHTML;
    onChange(content);
  };

  return (
    <div className="relative">
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        onInput={handleInput}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default Editor; 