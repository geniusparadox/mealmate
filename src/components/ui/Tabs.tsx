"use client";

import { useState, createContext, useContext, ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

// Main Tabs Container
interface TabsProps {
  defaultTab?: string;
  children: ReactNode;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs = ({
  defaultTab,
  children,
  onChange,
  className = "",
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || "");

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// Tab List (container for tab buttons)
interface TabListProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export const TabList = ({
  children,
  className = "",
  variant = "default",
}: TabListProps) => {
  const variantStyles = {
    default:
      "flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg",
    pills: "flex gap-2",
    underline: "flex gap-4 border-b border-gray-200 dark:border-gray-700",
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`} role="tablist">
      {children}
    </div>
  );
};

// Individual Tab Button
interface TabProps {
  id: string;
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export const Tab = ({
  id,
  children,
  disabled = false,
  icon,
  className = "",
  variant = "default",
}: TabProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  const baseStyles =
    "flex items-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2";

  const variantStyles = {
    default: `
      px-4 py-2 rounded-md text-sm
      ${
        isActive
          ? "bg-white dark:bg-gray-700 text-orange-600 shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }
    `,
    pills: `
      px-4 py-2 rounded-full text-sm
      ${
        isActive
          ? "bg-orange-500 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }
    `,
    underline: `
      px-1 py-3 text-sm border-b-2 -mb-px
      ${
        isActive
          ? "border-orange-500 text-orange-600"
          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300"
      }
    `,
  };

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      id={`tab-${id}`}
      onClick={() => !disabled && setActiveTab(id)}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {icon}
      {children}
    </button>
  );
};

// Tab Panel (content container)
interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const TabPanel = ({ id, children, className = "" }: TabPanelProps) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      className={`mt-4 ${className}`}
    >
      {children}
    </div>
  );
};

// Simple Tabs Component (all-in-one)
interface SimpleTabsProps {
  tabs: {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }[];
  defaultTab?: string;
  variant?: "default" | "pills" | "underline";
  onChange?: (tabId: string) => void;
  className?: string;
}

export const SimpleTabs = ({
  tabs,
  defaultTab,
  variant = "default",
  onChange,
  className = "",
}: SimpleTabsProps) => {
  return (
    <Tabs
      defaultTab={defaultTab || tabs[0]?.id}
      onChange={onChange}
      className={className}
    >
      <TabList variant={variant}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            disabled={tab.disabled}
            variant={variant}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id}>
          {tab.content}
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default Tabs;
