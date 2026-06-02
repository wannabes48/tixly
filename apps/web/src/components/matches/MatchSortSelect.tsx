'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MatchSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'date_asc';

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative shrink-0">
      <Select value={currentSort} onValueChange={handleChange}>
        <SelectTrigger className="w-[200px] text-sm border-gray-200 rounded-xl py-2.5 px-4 bg-white text-gray-700 focus:ring-tixOrange shadow-soft hover:border-tixNavy font-medium">
          <SelectValue placeholder="Sort..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date_asc">Sort: Date (Earliest)</SelectItem>
          <SelectItem value="price_asc">Sort: Price (Lowest)</SelectItem>
          <SelectItem value="price_desc">Sort: Price (Highest)</SelectItem>
          <SelectItem value="tickets_desc">Sort: Most Tickets</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
