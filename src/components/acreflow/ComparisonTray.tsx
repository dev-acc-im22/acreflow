'use client';

import React from 'react';

interface ComparisonRowProps {
  label: string;
  values: (string | number | boolean | React.ReactNode | undefined)[];
  highlightBest?: 'min' | 'max';
  rowIdx: number;
}

export function ComparisonRow({ label, values, highlightBest, rowIdx }: ComparisonRowProps) {
  const isEven = rowIdx % 2 === 0;
  const bestIdx: number = highlightBest
    ? values.reduce<number>((bestIdx, val, idx) => {
        if (typeof val !== 'number') return bestIdx;
        if (bestIdx === -1) return idx;
        const bestVal = values[bestIdx];
        if (typeof bestVal !== 'number') return idx;
        if (highlightBest === 'min' && val < bestVal) return idx;
        if (highlightBest === 'max' && val > bestVal) return idx;
        return bestIdx;
      }, -1)
    : -1;

  return (
    <div
      className={`grid gap-0 ${
        isEven ? 'bg-cream dark:bg-[#0A192F]' : 'bg-white dark:bg-[#112240]'
      }`}
    >
      {/* Label column */}
      <div
        className={`min-w-[140px] p-3 text-xs font-medium text-slate-accent dark:text-[#94A3B8] border-r border-border flex items-center`}
      >
        {label}
      </div>
      {/* Value columns */}
      {values.map((val, idx) => (
        <div
          key={idx}
          className={`min-w-[180px] p-3 text-sm text-navy dark:text-white font-medium flex items-center border-r border-border last:border-r-0 ${
            bestIdx === idx ? 'text-success bg-success/10 dark:bg-success/20' : ''
          }`}
        >
          {typeof val === 'boolean' ? (
            val ? (
              <span className="text-success">✓</span>
            ) : (
              <span className="text-slate-light dark:text-[#64748B]">✗</span>
            )
          ) : (
            <span>{val !== undefined && val !== '' ? val : '—'}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// The fixed tray is no longer used — ComparePage handles comparison UI.
// This component is kept for backward compatibility; it renders nothing.
export default function ComparisonTray() {
  return null;
}
