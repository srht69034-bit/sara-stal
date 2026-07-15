"use client";

import { useState } from "react";

type Tab = { id: string; label: string; content: React.ReactNode };

export default function AdminTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-mist mb-10 sticky top-0 bg-bone z-10 py-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`text-sm px-4 py-2.5 transition-colors duration-200 ${
              active === tab.id ? "bg-ink text-bone" : "text-stone hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} className={active === tab.id ? "block" : "hidden"}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
