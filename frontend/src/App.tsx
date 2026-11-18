import { useState } from 'react';
import Header from './components/Header';
import HeroMarketplaceStage from './components/HeroMarketplaceStage';
import ProductCatalog from './components/ProductCatalog';
import BusinessBentoSection from './components/BusinessBentoSection';
import OrderFlow from './components/OrderFlow';
import Advantages from './components/Advantages';
import LocationSection from './components/LocationSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import BackToTop from './components/BackToTop';
import ProductDetailView from './components/ProductDetailView';
import InquiryDrawer from './components/InquiryDrawer';
import FadeInSection from './components/FadeInSection';
import { Product, ProductCategory, InquiryItem } from './types';
import { AppProvider, useAppConfig } from './contexts/ConfigContext';

function MainApp() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'Semua'>('Semua');
  const [inquiryItems, setInquiryItems] = useState<InquiryItem[]>([]);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const { loading, error } = useAppConfig();

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ProductCategory | 'Semua') => {
    setSelectedCategory(cat);
    setSelectedProduct(null);
  };

  const handleGoHome = (anchorId?: string) => {
    setSelectedProduct(null);
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToInquiry = (newItem: InquiryItem) => {
    setInquiryItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product.id === newItem.product.id &&
          i.selectedMaterial === newItem.selectedMaterial &&
          i.sizeOrLength === newItem.sizeOrLength &&
          (i.designUrl || '') === (newItem.designUrl || '')
      );
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
                customOptions: newItem.customOptions || item.customOptions,
                note: newItem.note || item.note,
              }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQty = (index: number, delta: number) => {
    setInquiryItems((prev) =>
      prev
        .map((item, idx) =>
          idx === index ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (index: number) => {
    setInquiryItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSelectProduct={handleSelectProduct}
        inquiryCount={inquiryItems.length}
        onOpenInquiry={() => setIsInquiryOpen(true)}
        onGoHome={handleGoHome}
      />

      <main className="flex-1 w-full overflow-hidden">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToInquiry={handleAddToInquiry}
          />
        ) : (
          <>
            {/* 1. Connected Category Sidebar + Banner + Side Promos + 4 Feature Cards */}
            <HeroMarketplaceStage
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              onSelectProduct={handleSelectProduct}
            />

            {/* 2. Produk Pilihan (Search + Filter Tabs + 5-Column Catalog Grid) */}
            <FadeInSection>
              <ProductCatalog
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={handleSelectCategory}
                onSelectProduct={handleSelectProduct}
              />
            </FadeInSection>

            {/* 3. Penunjang Tim & Bisnis Anda (Asymmetric Bento Grid) */}
            <FadeInSection>
              <BusinessBentoSection onSelectProduct={handleSelectProduct} />
            </FadeInSection>

            {/* 4. Cara Mudah Order Online (5-Step Band) */}
            <FadeInSection>
              <OrderFlow />
            </FadeInSection>

            {/* 5. Keunggulan MI Apparel */}
            <FadeInSection>
              <Advantages />
            </FadeInSection>

            {/* 6. Informasi Kontak & Lokasi Workshop */}
            <FadeInSection>
              <LocationSection />
            </FadeInSection>

            {/* 7. FAQ */}
            <FadeInSection>
              <FAQ />
            </FadeInSection>
          </>
        )}
      </main>

      <Footer onSelectCategory={handleSelectCategory} />
      <BackToTop />
      <WhatsAppButton />

      <InquiryDrawer
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        items={inquiryItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClear={() => setInquiryItems([])}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
