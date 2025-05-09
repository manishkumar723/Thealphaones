import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';

const AIMocktest = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');

  // Initialize with default code
  React.useEffect(() => {
    setCode('// Start coding here...');
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <select 
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>
      
      <div className="w-full rounded-lg overflow-hidden border border-gray-700">
        <CodeEditor 
          language={selectedLanguage}
          code={code}
          setCode={setCode}
          onRun={() => console.log('Code submitted:', code)}
        />
      </div>
    </div>
  );
};

export default AIMocktest;