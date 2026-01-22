import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
  label,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && !compact && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
          rounded-lg shadow-sm text-left cursor-pointer 
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          transition-colors duration-200
          ${compact ? 'pl-2 pr-6 py-1.5 text-sm' : 'pl-3 pr-10 py-2'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-gray-500'}
          ${isOpen ? 'ring-2 ring-purple-500 border-purple-500' : ''}
        `}
      >
        <span className="flex items-center">
          {selectedOption?.icon && (
            <selectedOption.icon className={`${compact ? 'w-3 h-3 mr-1' : 'w-4 h-4 mr-2'} text-gray-500 dark:text-gray-400`} />
          )}
          <span className={`block truncate ${
            selectedOption 
              ? 'text-gray-900 dark:text-white' 
              : 'text-gray-500 dark:text-gray-400'
          } ${compact ? 'text-sm' : ''}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <span className={`absolute inset-y-0 right-0 flex items-center pointer-events-none ${compact ? 'pr-1' : 'pr-2'}`}>
          <ChevronDown 
            className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </span>
      </button>

      {isOpen && (
        <div className={`
          absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg py-1 
          ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none 
          border border-gray-200 dark:border-gray-600
          ${compact ? 'max-h-48 text-sm' : 'max-h-60 text-base'}
        `}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                relative w-full cursor-pointer select-none text-left
                hover:bg-purple-50 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400
                transition-colors duration-150
                ${compact ? 'py-1.5 pl-2 pr-6' : 'py-2 pl-3 pr-9'}
                ${value === option.value 
                  ? 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400' 
                  : 'text-gray-900 dark:text-white'
                }
              `}
            >
              <div className="flex items-center">
                {option.icon && (
                  <option.icon className={`${compact ? 'w-3 h-3 mr-1' : 'w-4 h-4 mr-2'} text-gray-500 dark:text-gray-400`} />
                )}
                <span className={`block truncate ${
                  value === option.value ? 'font-medium' : 'font-normal'
                } ${compact ? 'text-sm' : ''}`}>
                  {option.label}
                </span>
              </div>

              {value === option.value && (
                <span className={`absolute inset-y-0 right-0 flex items-center text-purple-600 dark:text-purple-400 ${compact ? 'pr-1' : 'pr-3'}`}>
                  <Check className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;