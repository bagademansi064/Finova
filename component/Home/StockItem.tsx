import { useStockDetail } from "@/lib/context/StockDetailContext";

interface StockItemProps {
  symbol: string;
  name: string;
  exchange: string;
  badge?: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  clubName?: string;
  isPL?: boolean; // If true, shows P/L instead of daily change
}

export default function StockItem({
  symbol,
  name,
  exchange,
  badge,
  price,
  change,
  changePercent,
  isPositive,
  clubName,
  isPL,
}: StockItemProps) {
  const { openStockDetail } = useStockDetail();
  return (
    <div 
      onClick={() => openStockDetail(symbol)}
      className="flex items-center justify-between py-3.5 animate-fade-in-up hover:bg-[#f7f9f8] transition-colors rounded-xl px-2 -mx-2 cursor-pointer active:scale-[0.98]"
    >
      {/* Left side */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-bold text-[#0E1B19] tracking-tight">{name}</span>
        <div className="flex items-center gap-2">
          {clubName ? (
            <span className="text-[10px] font-bold text-[#00695C] bg-[#e8f5e9] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              Via {clubName}
            </span>
          ) : (
             <span className="text-[11px] font-medium text-[#8a9690]">{exchange}</span>
          )}
          {badge && (
            <span className="rounded-sm bg-[#e8f5e9] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#00695C]">
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-0.5">
        <span
          className={`text-[15px] font-bold ${
            isPositive ? "text-[#00897B]" : "text-[#e53935]"
          }`}
        >
          ₹{parseFloat(price).toLocaleString('en-IN', {minimumFractionDigits: 2})}
        </span>
        <div className="flex items-center gap-1">
          <span className={`text-[11px] font-bold ${
            isPositive ? "text-[#00897B]" : "text-[#e53935]"
          }`}>
            {isPositive ? "+" : ""}{changePercent}
          </span>
          {isPL && (
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">P/L</span>
          )}
        </div>
      </div>
    </div>
  );
}
