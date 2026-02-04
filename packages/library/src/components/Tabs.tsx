import React, { createContext, useContext, useState } from "react";
import styles from "./tabs.module.css";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within Tabs");
  }
  return context;
};

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
  className = "",
}) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`${styles.tabs} ${className}`.trim()}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

export const TabsList: React.FC<TabsListProps> = ({
  children,
  className = "",
  "aria-label": ariaLabel,
}) => {
  return (
    <div
      role='tablist'
      aria-label={ariaLabel}
      className={`${styles.tabsList} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value: triggerValue,
  children,
  className = "",
  disabled = false,
}) => {
  const { value, onValueChange } = useTabsContext();
  const isActive = value === triggerValue;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(triggerValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onValueChange(triggerValue);
    }
  };

  return (
    <button
      role='tab'
      aria-selected={isActive}
      aria-controls={`tabpanel-${triggerValue}`}
      id={`tab-${triggerValue}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${styles.tabsTrigger} ${isActive ? styles.tabsTriggerActive : ""} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value: contentValue,
  children,
  className = "",
}) => {
  const { value } = useTabsContext();
  const isActive = value === contentValue;

  return (
    <div
      role='tabpanel'
      id={`tabpanel-${contentValue}`}
      aria-labelledby={`tab-${contentValue}`}
      tabIndex={0}
      className={`${styles.tabsContent} ${isActive ? styles.tabsContentActive : styles.tabsContentHidden} ${className}`.trim()}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
};
