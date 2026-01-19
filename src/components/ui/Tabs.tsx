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
      "flex gap-1 p-1.5 bg-[var(--background-secondary)] rounded-2xl",
    pills: "flex gap-2 p-2",
    underline: "flex gap-6 border-b border-[var(--color-light-gray)]/50 px-2",
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
    "flex items-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus-ring";

  const variantStyles = {
    default: `
      px-5 py-2.5 rounded-xl text-sm
      ${
        isActive
          ? "bg-[var(--background)] text-[var(--accent-primary)] shadow-premium"
          : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--color-light-gray)]/30"
      }
    `,
    pills: `
      px-5 py-2.5 rounded-xl text-sm
      ${
        isActive
          ? "bg-gradient-terracotta text-white shadow-premium"
          : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] hover:bg-[var(--color-light-gray)] hover:text-[var(--foreground)]"
      }
    `,
    underline: `
      px-1 py-4 text-sm border-b-2 -mb-px
      ${
        isActive
          ? "border-[var(--accent-primary)] text-[var(--accent-primary)]"
          : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--color-light-gray)]"
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
      {icon && <span className={isActive ? "text-current" : "opacity-70"}>{icon}</span>}
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
      className={`animate-fade-in ${className}`}
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
