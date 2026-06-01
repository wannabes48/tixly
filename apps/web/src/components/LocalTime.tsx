'use client';

import { useEffect, useState } from 'react';

interface LocalTimeProps {
  date: Date | string;
  className?: string;
  format?: 'time' | 'date' | 'datetime';
}

export function LocalTime({ date, className = '', format = 'time' }: LocalTimeProps) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    const d = new Date(date);
    
    if (format === 'time') {
      setFormatted(d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
    } else if (format === 'date') {
      setFormatted(d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }));
    } else {
      setFormatted(
        d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) +
        ' · ' +
        d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      );
    }
  }, [date, format]);

  // Prevent hydration mismatch by rendering a placeholder until mounted
  if (!formatted) {
    return <span className={`opacity-0 ${className}`}>--:--</span>;
  }

  return <span className={className}>{formatted}</span>;
}
