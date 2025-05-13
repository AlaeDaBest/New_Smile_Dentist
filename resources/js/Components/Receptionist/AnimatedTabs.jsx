// AnimatedTabs.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../../css/Receptionist/animated-tabs.css";

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { activeTab, setActiveTab })
  );
};

export const TabsList = ({ children }) => (
  <div className="tabs-list">{children}</div>
);

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    className={`tabs-trigger ${activeTab === value ? "active" : ""}`}
    onClick={() => setActiveTab(value)}
  >
    {children}
    {activeTab === value && (
      <motion.div layoutId="underline" className="underline" />
    )}
  </button>
);

export const TabsContent = ({ value, activeTab, children }) => (
  <AnimatePresence mode="wait">
    {activeTab === value && (
      <motion.div
        key={value}
        className="tabs-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);
