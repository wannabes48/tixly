'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function MatchSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'date_asc';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative shrink-0">
      <select 
        value={currentSort}
        onChange={handleChange}
        className="w-full text-sm border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange shadow-soft appearance-none cursor-pointer hover:border-brand-midblue transition-colors font-medium"
      >
        <option value="date_asc">Sort: Date (Earliest)</option>
        <option value="price_asc">Sort: Price (Lowest)</option>
        <option value="price_desc">Sort: Price (Highest)</option>
        <option value="tickets_desc">Sort: Most Tickets</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
