import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Navbar from "./components/Navbar";
import FirebaseStatusBanner from "./components/FirebaseStatusBanner";
import StatsOverview from "./components/StatsOverview";
import GhariOrderForm from "./components/GhariOrderForm";
import MandalFilter from "./components/MandalFilter";
import DistributionTable from "./components/DistributionTable";
import ReceiptModal from "./components/ReceiptModal";
import Toast from "./components/Toast";
import {
  subscribeOrders,
  addGhariOrder,
  updateGhariOrder,
  deleteGhariOrder,
} from "./services/ghariService";
import { formatWeight } from "./utils/formatters";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    mode: "initializing",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [selectedMandal, setSelectedMandal] = useState("ALL");
  const [toast, setToast] = useState(null);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#ea580c", "#d97706", "#f59e0b", "#10b981"],
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Subscribe to real-time Firestore orders
  useEffect(() => {
    const unsubscribe = subscribeOrders(
      (items, status) => {
        setOrders(items);
        setConnectionStatus(status);
      },
      (error) => {
        showToast("Firebase sync issue: switched to local offline cache", "info");
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle Form Submit (Add or Update)
  const handleSubmitOrder = async (orderData) => {
    setIsLoading(true);

    try {
      if (editingOrder) {
        // Update existing order
        await updateGhariOrder(editingOrder.id, orderData);
        showToast(
          `ઓર્ડર સફળતાપૂર્વક સુધારાયો! (${orderData.karykartaName} - ${orderData.mandalName})`,
          "success"
        );
        setEditingOrder(null);
      } else {
        // Add new order
        const result = await addGhariOrder(orderData);
        triggerConfetti();
        showToast(
          `નવો ઘારી ઓર્ડર સફળતાપૂર્વક ઉમેરાયો! ટોકન: ${result.record?.tokenNo}`,
          "success"
        );
      }
    } catch (err) {
      console.error("Order submit failed:", err);
      showToast("ઓર્ડર સાચવતી વખતે ભૂલ થઈ. કૃપા કરીને ફરી પ્રયત્ન કરો.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete Order
  const handleDeleteOrder = async (id) => {
    try {
      await deleteGhariOrder(id);
      showToast("ઓર્ડર સફળતાપૂર્વક ડિલીટ કર્યો.", "info");
      if (editingOrder && editingOrder.id === id) {
        setEditingOrder(null);
      }
    } catch (err) {
      console.error("Order delete failed:", err);
      showToast("ડિલીટ કરતી વખતે ભૂલ થઈ.", "error");
    }
  };

  // Handle Edit initiate
  const handleEditInitiate = (order) => {
    setEditingOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  // Total weight in Kg across all orders
  const totalWeightKg = formatWeight(
    orders.reduce((sum, o) => sum + (parseFloat(o.totalWeightKg) || 0), 0)
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Navigation */}
      <Navbar
        connectionStatus={connectionStatus}
        totalOrders={orders.length}
        totalWeightKg={totalWeightKg}
      />

      {/* Firebase Status Banner */}
      <FirebaseStatusBanner status={connectionStatus} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI / Stats Overview */}
        <StatsOverview orders={orders} />

        {/* 2-Column Responsive Layout: Form on Left/Top, List on Right/Bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Order Form Column */}
          <div className="lg:col-span-5">
            <GhariOrderForm
              onSubmit={handleSubmitOrder}
              editingOrder={editingOrder}
              onCancelEdit={handleCancelEdit}
              isLoading={isLoading}
            />
          </div>

          {/* Mandal Filter and Distribution Records Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Mandal Filter Pills */}
            <MandalFilter
              selectedMandal={selectedMandal}
              onSelectMandal={setSelectedMandal}
              orders={orders}
            />

            {/* Distribution Table */}
            <DistributionTable
              orders={orders}
              selectedMandal={selectedMandal}
              onEdit={handleEditInitiate}
              onDelete={handleDeleteOrder}
              onViewReceipt={(order) => setSelectedReceiptOrder(order)}
            />
          </div>
        </div>
      </main>

      {/* Printable Receipt / Token Modal */}
      {selectedReceiptOrder && (
        <ReceiptModal
          order={selectedReceiptOrder}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-amber-200/80 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-stone-700">
            સૂરત મંડળ વાઈઝ કાર્યકર્તા ઘારી વિતરણ સેવા પોર્ટલ (Surat Ghari Distribution Portal)
          </p>
          <p>
            Developed with React 19, Tailwind CSS & Firebase Cloud Firestore • 500 Gm (₹500) & 1 Kg (₹1000)
          </p>
        </div>
      </footer>
    </div>
  );
}
