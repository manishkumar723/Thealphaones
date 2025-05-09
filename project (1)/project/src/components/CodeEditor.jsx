import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import * as codeMirrorLangs from '@uiw/codemirror-extensions-langs';
import { Play, Clock, RotateCcw } from 'lucide-react';

const CodeEditor = ({ 
  code, 
  setCode, 
  language = 'cpp', 
  onRun, 
  result = null, 
  isLoading = false 
}) => {
  const [timeComplexity, setTimeComplexity] = useState('O(n)'); // Example default
  
  const getLanguageExtension = (lang) => {
    switch (lang.toLowerCase()) {
      case 'c':
      case 'cpp':
      case 'c++':
        return codeMirrorLangs.cpp();
      case 'java':
        return codeMirrorLangs.cpp(); // Using cpp for now, could be replaced with Java when available
      default:
        return codeMirrorLangs.cpp();
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleRun = () => {
    if (onRun && typeof onRun === 'function') {
      onRun(code);
    }
  };

  const renderComplexityBadge = () => {
    const complexityMap = {
      'O(1)': 'bg-green-500',
      'O(log n)': 'bg-green-400',
      'O(n)': 'bg-blue-500',
      'O(n log n)': 'bg-yellow-500',
      'O(n²)': 'bg-orange-500',
      'O(n³)': 'bg-red-500',
      'O(2^n)': 'bg-red-600',
      'O(n!)': 'bg-red-700',
    };

    const bgColor = complexityMap[timeComplexity] || 'bg-gray-500';

    return (
      <span className={`${bgColor} text-white text-xs font-medium px-2.5 py-0.5 rounded`}>
        {timeComplexity}
      </span>
    );
  };

  return (
    <div className="card flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Code Editor</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Clock size={16} className="mr-1 text-gray-400" />
            <span className="text-sm mr-2">Time Complexity:</span>
            {renderComplexityBadge()}
          </div>
          <select 
            className="select-field text-sm py-1 px-2 max-w-[100px]"
            value={language}
            onChange={(e) => console.log(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>
      
      <div className="border border-gray-700 rounded-md overflow-hidden mb-4">
        <CodeMirror
          value={code}
          height="300px"
          theme={vscodeDark}
          extensions={[getLanguageExtension(language)]}
          onChange={handleCodeChange}
        />
      </div>
      
      <div className="flex justify-between">
        <button 
          className="btn-primary flex items-center"
          onClick={handleRun}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Running...
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Run Code
            </>
          )}
        </button>
        
        <button 
          className="btn-secondary flex items-center"
          onClick={() => setCode('')}
        >
          <RotateCcw size={16} className="mr-2" />
          Reset
        </button>
      </div>
      
      {result && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Output:</h4>
          <div className="bg-gray-900 p-3 rounded-md">
            <pre className="text-green-400 whitespace-pre-wrap">{result.output}</pre>
          </div>
          
          {result.error && (
            <div className="mt-2">
              <h4 className="font-semibold mb-2 text-red-400">Errors:</h4>
              <div className="bg-gray-900 p-3 rounded-md">
                <pre className="text-red-400 whitespace-pre-wrap">{result.error}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;