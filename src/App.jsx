import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import Navbar from "./components/Navbar";
import LoginDashboard from "./components/LoginDashboard";
import SetPasswordModal from "./components/SetPasswordModal";
import KarykartaPortal from "./components/KarykartaPortal";
import PradeshAdminDashboard from "./components/PradeshAdminDashboard";
import ReceiptModal from "./components/ReceiptModal";
import Toast from "./components/Toast";
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
} from "./services/authService";
import {
  subscribeOrders,
  addGhariOrder,
  updateGhariOrder,
  deleteGhariOrder,
} from "./services/ghariService";
import { formatWeight } from "./utils/formatters";

export default function App() {
  const [currentUser, setLocalCurrentUser] = useState(getCurrentUser());
  const [requiresPasswordSetup, setRequiresPasswordSetup] = useState(null);
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
      // Ignore
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

  // Handle Login Success
  const handleLoginSuccess = (user) => {
    setLocalCurrentUser(user);
    setRequiresPasswordSetup(null);
    showToast(`સ્વાગત છે, ${user.name}! (${user.role === "admin" ? "પ્રદેશ એડમિન" : user.mandalName})`, "success");
  };

  // Handle requirement to set custom password
  const handleRequirePasswordSetup = (user) => {
    setRequiresPasswordSetup(user);
  };

  // Handle password set success
  const handlePasswordSetSuccess = (user) => {
    setRequiresPasswordSetup(null);
    setLocalCurrentUser(user);
    showToast("નવો પાસવર્ડ સફળતાપૂર્વક સેટ થયો! પોર્ટલમાં સ્વાગત છે.", "success");
  };

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setLocalCurrentUser(null);
    setRequiresPasswordSetup(null);
    setEditingOrder(null);
    showToast("સફળતાપૂર્વક લૉગ આઉટ થયા.", "info");
  };

  // Handle Form Submit (Add or Update)
  const handleSubmitOrder = async (orderData) => {
    setIsLoading(true);

    try {
      if (editingOrder) {
        // Update existing order
        await updateGhariOrder(editingOrder.id, orderData);
        showToast(
          `ઓર્ડર સફળતાપૂર્વક સુધારાયો! (${orderData.karykartaName})`,
          "success"
        );
        setEditingOrder(null);
      } else {
        // Add new order
        const result = await addGhariOrder(orderData);
        triggerConfetti();
        showToast(
          `નવો ઘારી ઓર્ડર સફળતાપૂર્વક ઉમેરાયો! ટોકન: ${result.record?.tokenNo} (પ્રદેશ કક્ષાએ પ્રતિબિંબિત)`,
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

  // 1. If user needs to set password on first-time login => Redirect to Set Password Screen
  if (requiresPasswordSetup) {
    return (
      <>
        <SetPasswordModal
          user={requiresPasswordSetup}
          onSuccess={handlePasswordSetSuccess}
          onCancel={() => {
            setRequiresPasswordSetup(null);
            setLocalCurrentUser(null);
          }}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // 2. If user is not logged in => Show Login Dashboard
  if (!currentUser) {
    return (
      <>
        <LoginDashboard
          onLoginSuccess={handleLoginSuccess}
          onRequirePasswordSetup={handleRequirePasswordSetup}
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // 3. User is authenticated => Render Ghari Order Dashboard (Karykarta) or Pradesh Admin Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Navigation */}
      <Navbar
        connectionStatus={connectionStatus}
        totalOrders={orders.length}
        totalWeightKg={totalWeightKg}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser?.role === "admin" ? (
          /* PRADESH LEVEL ADMIN DASHBOARD */
          <PradeshAdminDashboard
            orders={orders}
            selectedMandal={selectedMandal}
            onSelectMandal={setSelectedMandal}
            onEditOrder={handleEditInitiate}
            onDeleteOrder={handleDeleteOrder}
            onViewReceipt={(order) => setSelectedReceiptOrder(order)}
            onSubmitOrder={handleSubmitOrder}
            editingOrder={editingOrder}
            onCancelEdit={handleCancelEdit}
            isLoading={isLoading}
            showToast={showToast}
          />
        ) : (
          /* KARYAKARTA DASHBOARD */
          <KarykartaPortal
            currentUser={currentUser}
            allOrders={orders}
            onSubmitOrder={handleSubmitOrder}
            onViewReceipt={(order) => setSelectedReceiptOrder(order)}
            isLoading={isLoading}
          />
        )}
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
            પ્રદેશ કક્ષા લાઈવ ડેટાબેઝ • 500 Gm (₹500) • 1 Kg (₹1000) • Real-time Firebase Firestore
          </p>
        </div>
      </footer>
    </div>
  );
}
