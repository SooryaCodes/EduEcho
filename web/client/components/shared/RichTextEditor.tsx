'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Link,
  Mic,
  MicOff
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showVoiceButton?: boolean;
  isRecording?: boolean;
  onVoiceToggle?: () => void;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = '',
  showVoiceButton = false,
  isRecording = false,
  onVoiceToggle
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
  ];

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map(({ icon: Icon, command, value, title }, index) => (
            <Button
              key={`${command}-${value || index}`}
              type="button"
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
              onClick={() => execCommand(command, value)}
              title={title}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
          
          <div className="w-px h-6 bg-gray-300 mx-2" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={insertLink}
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </Button>
        </div>

        {/* Voice Button */}
        {showVoiceButton && (
          <Button
            type="button"
            onClick={onVoiceToggle}
            className={`w-8 h-8 p-0 rounded-full ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-gradient hover:opacity-90'
            } text-white`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[120px] max-h-[300px] overflow-y-auto focus:outline-none"
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{
          whiteSpace: 'pre-wrap',
        }}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 0.5rem 0;
          color: #6b7280;
          font-style: italic;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 0.75rem;
          border-radius: 0.375rem;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
        }
        
        [contenteditable] a {
          color: #8b5cf6;
          text-decoration: underline;
        }
        
        [contenteditable] strong {
          font-weight: bold;
        }
        
        [contenteditable] em {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
