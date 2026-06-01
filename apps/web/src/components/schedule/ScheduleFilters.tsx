'use client';
import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const rounds = [
  'Group Stage',
  'Round of 32',
  'Round of 16',
  'Quarter-Finals',
  'Semi-Finals',
  'Third-Place Play-Off',
  'Final'
];

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const countries = [
  { label: 'USA 🇺🇸', value: 'US' },
  { label: 'Mexico 🇲🇽', value: 'MX' },
  { label: 'Canada 🇨🇦', value: 'CA' }
];

export function ScheduleFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRound = searchParams.get('round');
  const currentGroup = searchParams.get('group');
  const currentCountry = searchParams.get('country');

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && params.get(key) === value) {
      params.delete(key);
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    router.push(pathname);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-brand-navy">Filter Schedule</h3>
        {(currentRound || currentGroup || currentCountry) && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-brand-orange hover:text-brand-orange hover:bg-orange-50 h-8">
            Clear Filters
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Round Filter */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            Tournament Stage
          </label>
          <div className="flex flex-wrap gap-2">
            {rounds.map((round) => (
              <button
                key={round}
                onClick={() => updateParam('round', round)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentRound === round
                    ? 'bg-brand-navy text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {round}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Filter */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Group
            </label>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() => updateParam('group', group)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                    currentGroup === group
                      ? 'bg-brand-orange text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  disabled={Boolean(currentRound && currentRound !== 'Group Stage')}
                  title={currentRound && currentRound !== 'Group Stage' ? "Only available in Group Stage" : ""}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Host Country
            </label>
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateParam('country', c.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                    currentCountry === c.value
                      ? 'bg-brand-midblue text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
