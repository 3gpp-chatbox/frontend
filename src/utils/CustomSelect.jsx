import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    setSelectedValue(optionValue);
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || placeholder;

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div 
        className="custom-select-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? '' : 'placeholder'}>
          {selectedLabel}
        </span>
        <span className="custom-select-arrow">▼</span>
      </div>
      
      {isOpen && (
        <div className="custom-select-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${option.value === selectedValue ? 'selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect; 