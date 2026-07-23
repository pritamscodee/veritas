import { Link, useLocation } from "react-router-dom";
import { Shield, Vote, BarChart3, PlusCircle, Activity, Coins, Layers, ArrowLeftRight, Boxes, Globe } from "lucide-react";
import { cn, formatAddress } from "@/lib/utils";

interface NavbarProps {
  accountId: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  connecting: boolean;
}

const navLinks = [
  { to: "/", label: "Elections", icon: Vote },
  { to: "/create", label: "Create", icon: PlusCircle },
  { to: "/ecosystem", label: "Ecosystem", icon: Globe },
  { to: "/payments", label: "Payments", icon: Coins },
  { to: "/assets", label: "Tokens", icon: Layers },
  { to: "/ramp", label: "Ramp", icon: ArrowLeftRight },
  { to: "/defi", label: "DeFi", icon: Boxes },
  { to: "/health", label: "Status", icon: Activity },
];

export default function Navbar({ accountId, onConnect, onDisconnect, connecting }: NavbarProps) {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-stellar-dark/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-stellar-blue" />
            <span className="text-xl font-bold tracking-tight">Veritas</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === to
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {accountId ? (
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-white/70 sm:block">
                {formatAddress(accountId)}
              </span>
              <button onClick={onDisconnect} className="btn-secondary text-xs">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={onConnect} disabled={connecting} className="btn-stellar">
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
