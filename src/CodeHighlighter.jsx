import React, { useEffect } from 'react';
import Rainbow from 'rainbow-code';

const CodeHighlighter = ({ code }) => {
  useEffect(() => {
    Rainbow.color();
  }, []);

  return (
    <pre>
      <code className="language-html">
        {code}
      </code>
    </pre>
  );
};

export default CodeHighlighter;
