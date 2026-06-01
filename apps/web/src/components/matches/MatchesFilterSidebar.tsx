'use client';
import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { SlidersHorizontal } from "lucide-react";

import { TeamMultiSelect } from "./TeamMultiSelect";
import { DateRangePicker } from "./DateRangePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const hostCountries = [
  { label: 'United States', code: 'US', emoji: '🇺🇸' },
  { label: 'Mexico', code: 'MX', emoji: '🇲🇽' },
  { label: 'Canada', code: 'CA', emoji: '🇨🇦' },
];

const tournamentStages = [
  { label: 'Group Stage', key: 'Group Stage' },
  { label: 'Round of 32', key: 'Round of 32' },
  { label: 'Round of 16', key: 'Round of 16' },
  { label: 'Quarter-Finals', key: 'Quarter-Finals' },
  { label: 'Semi-Finals', key: 'Semi-Finals' },
  { label: 'Third-Place Play-Off', key: 'Third-Place Play-Off' },
  { label: 'Final', key: 'Final' },
];

const ticketCategories = [
  'Category 1',
  'Category 2',
  'Category 3',
  'Category 4',
  'Accessibility',
];

interface MatchesFilterSidebarProps {
  onApplyMobile?: () => void;
  teamOptions: { label: string; value: string; emoji?: string }[];
}

export function MatchesFilterSidebar({ onApplyMobile, teamOptions }: MatchesFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State parsed from URL
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
    const from = searchParams.get("dateFrom");
    const to = searchParams.get("dateTo");
    if (from) {
      return {
        from: new Date(from),
        to: to ? new Date(to) : undefined,
      };
    }
    return undefined;
  });

  const [selectedTeams, setSelectedTeams] = React.useState<string[]>(
    searchParams.get("teams")?.split(",").filter(Boolean) || []
  );

  const [selectedRounds, setSelectedRounds] = React.useState<string[]>(
    searchParams.get("rounds")?.split(",").filter(Boolean) || []
  );

  const [selectedCountries, setSelectedCountries] = React.useState<string[]>(
    searchParams.get("countries")?.split(",").filter(Boolean) || []
  );

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    searchParams.get("categories")?.split(",").filter(Boolean) || []
  );

  const [priceRange, setPriceRange] = React.useState<number[]>(() => {
    const min = searchParams.get("minPrice");
    const max = searchParams.get("maxPrice");
    return [min ? parseInt(min) : 0, max ? parseInt(max) : 2500];
  });

  // Apply filters to URL
  const applyFilters = React.useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    applyFilters({
      dateFrom: range?.from ? format(range.from, "yyyy-MM-dd") : null,
      dateTo: range?.to ? format(range.to, "yyyy-MM-dd") : null,
    });
  };

  const handleTeamsChange = (teams: string[]) => {
    setSelectedTeams(teams);
    applyFilters({ teams: teams.length ? teams.join(",") : null });
  };

  const toggleArrayItem = (
    item: string,
    state: string[],
    setState: (v: string[]) => void,
    paramKey: string
  ) => {
    const next = state.includes(item) ? state.filter((i) => i !== item) : [...state, item];
    setState(next);
    applyFilters({ [paramKey]: next.length ? next.join(",") : null });
  };

  const handlePriceChange = (val: number[]) => {
    setPriceRange(val);
  };
  const handlePriceCommit = (val: number[]) => {
    applyFilters({
      minPrice: val[0] > 0 ? val[0].toString() : null,
      maxPrice: val[1] < 2500 ? val[1].toString() : null,
    });
  };

  const clearAll = () => {
    setDateRange(undefined);
    setSelectedTeams([]);
    setSelectedRounds([]);
    setSelectedCountries([]);
    setSelectedCategories([]);
    setPriceRange([0, 2500]);
    router.push(pathname);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 h-full overflow-y-auto">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6 text-brand-navy hidden lg:flex">
        <SlidersHorizontal size={18} />
        <h2 className="text-base font-bold">Filters</h2>
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Date Range
        </h3>
        <DateRangePicker date={dateRange} onChange={handleDateChange} />
      </div>
      <div className="border-t border-gray-100 mb-6" />

      {/* Host Country */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Host Country
        </h3>
        <div className="space-y-3">
          {hostCountries.map(({ label, code, emoji }) => (
            <div key={code} className="flex items-center space-x-2 group">
              <Checkbox
                id={`country-${code}`}
                checked={selectedCountries.includes(code)}
                onCheckedChange={() => toggleArrayItem(code, selectedCountries, setSelectedCountries, "countries")}
                className="border-gray-300 text-brand-orange data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
              />
              <label
                htmlFor={`country-${code}`}
                className="text-sm font-medium leading-none cursor-pointer text-gray-700 group-hover:text-brand-navy transition-colors"
              >
                {emoji} {label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 mb-6" />

      {/* Teams */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Teams
        </h3>
        <TeamMultiSelect
          options={teamOptions}
          selectedValues={selectedTeams}
          onChange={handleTeamsChange}
        />
      </div>
      <div className="border-t border-gray-100 mb-6" />

      {/* Tournament Stage */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Tournament Stage
        </h3>
        <div className="space-y-3">
          {tournamentStages.map(({ label, key }) => (
            <div key={key} className="flex items-center space-x-2 group">
              <Checkbox
                id={`stage-${key}`}
                checked={selectedRounds.includes(key)}
                onCheckedChange={() => toggleArrayItem(key, selectedRounds, setSelectedRounds, "rounds")}
                className="border-gray-300 text-brand-orange data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
              />
              <label
                htmlFor={`stage-${key}`}
                className="text-sm font-medium leading-none cursor-pointer text-gray-700 group-hover:text-brand-navy transition-colors"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 mb-6" />

      {/* Ticket Category */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Ticket Category
        </h3>
        <div className="space-y-3">
          {ticketCategories.map((cat) => (
            <div key={cat} className="flex items-center space-x-2 group">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleArrayItem(cat, selectedCategories, setSelectedCategories, "categories")}
                className="border-gray-300 text-brand-orange data-[state=checked]:bg-brand-orange data-[state=checked]:border-brand-orange"
              />
              <label
                htmlFor={`cat-${cat}`}
                className="text-sm font-medium leading-none cursor-pointer text-gray-700 group-hover:text-brand-navy transition-colors"
              >
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-100 mb-6" />

      {/* Price Range */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Price Range
          </h3>
          <span className="text-xs font-bold text-brand-navy">
            ${priceRange[0]} - ${priceRange[1]}{priceRange[1] === 2500 ? "+" : ""}
          </span>
        </div>
        <Slider
          defaultValue={[0, 2500]}
          value={priceRange}
          max={2500}
          step={50}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
          className="mt-4"
        />
      </div>

      <div className="flex flex-col gap-3">
        {onApplyMobile && (
          <Button onClick={onApplyMobile} className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl py-6 text-lg shadow-soft font-bold lg:hidden">
            Apply Filters
          </Button>
        )}
        <Button onClick={clearAll} variant="outline" className="w-full text-brand-navy border-gray-300 rounded-xl">
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
