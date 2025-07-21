import { useState, useCallback } from 'react';

export interface UseToggleableRadioReturn {
  selectedValue: string;
  handleRadioChange: (value: string, groupName?: string) => void;
  clearSelection: (groupName?: string) => void;
  isSelected: (value: string) => boolean;
  resetAllSelections: () => void;
}

export interface UseToggleableRadioOptions {
  initialValue?: string;
  onSelectionChange?: (value: string, previousValue: string) => void;
  allowDeselect?: boolean;
}

/**
 * Custom hook for managing toggleable radio button functionality
 * Allows users to select and deselect radio buttons by clicking them again
 */
export const useToggleableRadio = (
  options: UseToggleableRadioOptions = {}
): UseToggleableRadioReturn => {
  const {
    initialValue = '',
    onSelectionChange,
    allowDeselect = true,
  } = options;

  const [selectedValue, setSelectedValue] = useState<string>(initialValue);

  /**
   * Handle radio button change with toggle functionality
   */
  const handleRadioChange = useCallback((value: string, groupName?: string) => {
    const previousValue = selectedValue;

    if (allowDeselect && selectedValue === value) {
      // Deselect if clicking the same value
      setSelectedValue('');
      onSelectionChange?.('', previousValue);
    } else {
      // Select the new value
      setSelectedValue(value);
      onSelectionChange?.(value, previousValue);
    }

    // Log the change for debugging
    console.log(`🔘 Radio selection changed: ${previousValue} → ${selectedValue === value && allowDeselect ? '' : value}${groupName ? ` (group: ${groupName})` : ''}`);
  }, [selectedValue, allowDeselect, onSelectionChange]);

  /**
   * Clear selection for a specific group or all selections
   */
  const clearSelection = useCallback((groupName?: string) => {
    const previousValue = selectedValue;
    setSelectedValue('');
    onSelectionChange?.('', previousValue);
    
    console.log(`🔄 Radio selection cleared${groupName ? ` for group: ${groupName}` : ''}`);
  }, [selectedValue, onSelectionChange]);

  /**
   * Check if a value is currently selected
   */
  const isSelected = useCallback((value: string): boolean => {
    return selectedValue === value;
  }, [selectedValue]);

  /**
   * Reset all selections
   */
  const resetAllSelections = useCallback(() => {
    const previousValue = selectedValue;
    setSelectedValue('');
    onSelectionChange?.('', previousValue);
    
    console.log('🔄 All radio selections reset');
  }, [selectedValue, onSelectionChange]);

  return {
    selectedValue,
    handleRadioChange,
    clearSelection,
    isSelected,
    resetAllSelections,
  };
};

/**
 * Hook for managing multiple radio button groups with toggle functionality
 */
export interface UseMultipleToggleableRadioReturn {
  selections: Record<string, string>;
  handleRadioChange: (groupName: string, value: string) => void;
  clearSelection: (groupName: string) => void;
  isSelected: (groupName: string, value: string) => boolean;
  getSelection: (groupName: string) => string;
  resetAllSelections: () => void;
  resetGroup: (groupName: string) => void;
}

export interface UseMultipleToggleableRadioOptions {
  initialSelections?: Record<string, string>;
  onSelectionChange?: (groupName: string, value: string, previousValue: string) => void;
  allowDeselect?: boolean;
}

export const useMultipleToggleableRadio = (
  options: UseMultipleToggleableRadioOptions = {}
): UseMultipleToggleableRadioReturn => {
  const {
    initialSelections = {},
    onSelectionChange,
    allowDeselect = true,
  } = options;

  const [selections, setSelections] = useState<Record<string, string>>(initialSelections);

  /**
   * Handle radio button change for a specific group
   */
  const handleRadioChange = useCallback((groupName: string, value: string) => {
    const previousValue = selections[groupName] || '';

    setSelections(prev => {
      const newSelections = { ...prev };

      if (allowDeselect && prev[groupName] === value) {
        // Deselect if clicking the same value
        delete newSelections[groupName];
        onSelectionChange?.(groupName, '', previousValue);
      } else {
        // Select the new value
        newSelections[groupName] = value;
        onSelectionChange?.(groupName, value, previousValue);
      }

      return newSelections;
    });

    console.log(`🔘 Radio selection changed in group "${groupName}": ${previousValue} → ${selections[groupName] === value && allowDeselect ? '' : value}`);
  }, [selections, allowDeselect, onSelectionChange]);

  /**
   * Clear selection for a specific group
   */
  const clearSelection = useCallback((groupName: string) => {
    const previousValue = selections[groupName] || '';
    
    setSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[groupName];
      return newSelections;
    });

    onSelectionChange?.(groupName, '', previousValue);
    console.log(`🔄 Radio selection cleared for group: ${groupName}`);
  }, [selections, onSelectionChange]);

  /**
   * Check if a value is selected in a specific group
   */
  const isSelected = useCallback((groupName: string, value: string): boolean => {
    return selections[groupName] === value;
  }, [selections]);

  /**
   * Get the current selection for a group
   */
  const getSelection = useCallback((groupName: string): string => {
    return selections[groupName] || '';
  }, [selections]);

  /**
   * Reset all selections across all groups
   */
  const resetAllSelections = useCallback(() => {
    const previousSelections = { ...selections };
    setSelections({});
    
    // Notify about all cleared selections
    Object.keys(previousSelections).forEach(groupName => {
      onSelectionChange?.(groupName, '', previousSelections[groupName]);
    });

    console.log('🔄 All radio selections reset across all groups');
  }, [selections, onSelectionChange]);

  /**
   * Reset selections for a specific group
   */
  const resetGroup = useCallback((groupName: string) => {
    clearSelection(groupName);
  }, [clearSelection]);

  return {
    selections,
    handleRadioChange,
    clearSelection,
    isSelected,
    getSelection,
    resetAllSelections,
    resetGroup,
  };
};
