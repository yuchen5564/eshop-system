import React, { useState, useRef, useEffect } from 'react';
import EmojiPickerReact from 'emoji-picker-react';
import { Input } from 'antd';

const EmojiPicker = ({ value, onChange, placeholder, ...props }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const containerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    onChange(emojiData.emoji);
    setShowPicker(false);
  };

  const handleInputClick = (event) => {
    event.stopPropagation();
    setShowPicker(!showPicker);
  };

  const handleClickOutside = (event) => {
    // 檢查點擊是否在整個容器外部
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };

  useEffect(() => {
    if (showPicker) {
      // 延遲添加事件監聽器，避免立即觸發
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showPicker]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={handleInputClick}
        placeholder={placeholder}
        {...props}
      />
      {showPicker && (
        <div
          ref={pickerRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            marginTop: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          <EmojiPickerReact
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;