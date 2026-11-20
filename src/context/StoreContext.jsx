import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({
    storeName: 'EKE Digital',
    tagline: 'Pusat Produk Digital & Lisensi Terpercaya #1',
    waNumber: '6289604236160',
    markupPercent: 35,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedLicenseType, setSelectedLicenseType] = useState('personal');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active Order State
  const [activeOrder, setActiveOrder] = useState(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Toast notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 4000);
  }, []);

  // Fetch initial data
  const loadInitialData = useCallback(async (force = false) => {
    try {
      setLoading(true);
      const [prodRes, catRes, setRes] = await Promise.all([
        fetch(`/api/products${force ? '?refresh=true' : ''}`),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const setData = await setRes.json();

      if (prodData.success) setProducts(prodData.data);
      if (catData.success) setCategories(catData.data);
      if (setData.success) setSettings(setData.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Gagal memuat produk dari server upstream.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Open detail
  const openProductDetail = (product) => {
    setActiveProduct(product);
    setSelectedLicenseType('personal');
    setIsDetailOpen(true);
  };

  // Start checkout directly
  const startCheckout = (product, licenseType = 'personal') => {
    setActiveProduct(product);
    setSelectedLicenseType(licenseType);
    setIsDetailOpen(false);
    setIsCheckoutOpen(true);
  };

  // Submit checkout to create order
  const submitCheckout = async ({ buyerName, whatsapp, email }) => {
    if (!activeProduct) return;
    try {
      setIsSubmittingOrder(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: activeProduct.id,
          licenseType: selectedLicenseType,
          buyerName,
          whatsapp,
          email,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Gagal membuat pesanan');
      }

      setActiveOrder(json.data);
      setIsCheckoutOpen(false);
      setIsPaymentOpen(true);
      showToast('Tagihan QRIS berhasil dibuat!', 'success');
    } catch (err) {
      console.error('Error submitting order:', err);
      showToast(err.message, 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Check payment status with backend (which checks AutoGoPay)
  const checkPaymentStatus = async (orderId) => {
    if (!orderId) return null;
    try {
      const res = await fetch(`/api/orders/${orderId}/check-payment`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.success && (json.data?.status === 'completed' || json.data?.status === 'paid')) {
        setActiveOrder(json.data);
        setIsPaymentOpen(false);
        setIsSuccessOpen(true);
        showToast('Pembayaran Diterima! Lisensi Anda telah aktif.', 'success');
        return json.data;
      }
      return json.data;
    } catch (err) {
      console.error('Error checking payment:', err);
      return null;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        settings,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeProduct,
        selectedLicenseType,
        setSelectedLicenseType,
        isDetailOpen,
        setIsDetailOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isPaymentOpen,
        setIsPaymentOpen,
        isSuccessOpen,
        setIsSuccessOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isAdminOpen,
        setIsAdminOpen,
        activeOrder,
        setActiveOrder,
        isSubmittingOrder,
        toast,
        showToast,
        loadInitialData,
        openProductDetail,
        startCheckout,
        submitCheckout,
        checkPaymentStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
