import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Elections from "@/pages/Elections";
import ElectionDetail from "@/pages/ElectionDetail";
import CreateElection from "@/pages/CreateElection";
import Health from "@/pages/Health";
import Ecosystem from "@/pages/Ecosystem";
import Anchors from "@/pages/Anchors";
import Payments from "@/pages/Payments";
import Assets from "@/pages/Assets";
import Ramp from "@/pages/Ramp";
import DeFi from "@/pages/DeFi";
import { useWallet } from "@/hooks/useVeritas";

export default function App() {
  const { accountId, connecting, connect, disconnect } = useWallet();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        accountId={accountId}
        onConnect={connect}
        onDisconnect={disconnect}
        connecting={connecting}
      />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Elections />} />
          <Route path="/home" element={<Home />} />
          <Route path="/elections/:id" element={<ElectionDetail />} />
          <Route path="/create" element={<CreateElection />} />
          <Route path="/health" element={<Health />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/ecosystem/anchors" element={<Anchors />} />
          <Route path="/anchors" element={<Anchors />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/ramp" element={<Ramp />} />
          <Route path="/defi" element={<DeFi />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
