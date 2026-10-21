import React, { useState } from 'react';
import { PackageItem, TabDestination } from './types';
import { INITIAL_PACKAGES } from './data/shipments';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { LiveMapScreen } from './components/LiveMapScreen';
import { ShipmentsScreen } from './components/ShipmentsScreen';
import { PackageDetailsScreen } from './components/PackageDetailsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AddPackageModal } from './components/AddPackageModal';
import { ScannerModal } from './components/ScannerModal';
import { PreSignModal } from './components/PreSignModal';
import { ProofModal } from './components/ProofModal';
import { ManageDeliveryModal } from './components/ManageDeliveryModal';
import { CallCourierModal } from './components/CallCourierModal';
import { NotificationDrawer, NotificationItem } from './components/NotificationDrawer';

export default function App() {
  const [packages, setPackages] = useState<PackageItem[]>(INITIAL_PACKAGES);
  const [currentTab, setCurrentTab] = useState<TabDestination>('home');
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [previousTab, setPreviousTab] = useState<TabDestination>('home');

  // Modals & Drawers state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPreSignOpen, setIsPreSignOpen] = useState(false);
  const [packageForPreSign, setPackageForPreSign] = useState<PackageItem | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [packageForProof, setPackageForProof] = useState<PackageItem | null>(null);
  const [isManageDeliveryOpen, setIsManageDeliveryOpen] = useState(false);
  const [isCallCourierOpen, setIsCallCourierOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Active notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Van #402 Approaching',
      description: 'Elena is 2 stops away on Maple Ave. Estimated delivery in ~18 mins.',
      time: '14:20',
      icon: 'local_shipping',
      type: 'live',
    },
    {
      id: 'n-2',
      title: 'Direct Signature Required',
      description: 'Keychron Q1 Pro will require signature upon arrival on Wednesday.',
      time: '11:05',
      icon: 'draw',
      type: 'urgent',
    },
    {
      id: 'n-3',
      title: 'Delivered: Anker GaN Charger',
      description: 'Placed into Lobby Parcel Locker #04. Verification photo logged.',
      time: 'Yesterday',
      icon: 'task_alt',
      type: 'success',
    },
  ]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleSelectPackage = (pkg: PackageItem) => {
    setPreviousTab(currentTab);
    setSelectedPackage(pkg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetails = () => {
    setSelectedPackage(null);
  };

  const handleNavigateTab = (tab: TabDestination) => {
    setSelectedPackage(null);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPackage = (newPkg: PackageItem) => {
    setPackages([newPkg, ...packages]);
  };

  const handleScanResult = (scannedCode: string) => {
    // Check if package already exists
    const existing = packages.find(
      (p) => p.trackingNumber.toUpperCase() === scannedCode.toUpperCase()
    );
    if (existing) {
      handleSelectPackage(existing);
      showToast(`Located existing shipment: ${existing.title}`);
    } else {
      // Create new package entry from scanned code
      const scannedPkg: PackageItem = {
        id: `pkg-${Date.now()}`,
        trackingNumber: scannedCode,
        title: `Tracked Item #${scannedCode.slice(-4)}`,
        subtitle: 'Auto-detected via optical scanner',
        carrier: scannedCode.startsWith('1Z')
          ? 'UPS'
          : scannedCode.startsWith('DHL')
          ? 'DHL'
          : scannedCode.startsWith('9400')
          ? 'USPS'
          : 'FedEx',
        serviceType: 'Priority Express',
        status: 'in_transit',
        statusLabel: 'In Transit • Scanned',
        eta: 'In 2 Days',
        etaFormatted: 'Expected in 48 hours',
        progressPercent: 40,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80',
        weight: '1.25 kg',
        weightTare: '2.8 lbs',
        dimensions: '26×18×10',
        dimensionsUnit: 'Centimeters',
        originFacility: 'Scanned at Logistics Depot',
        originLocation: 'United States',
        destination: 'Seattle, WA',
        destinationType: 'Residential Drop-Off',
        signatureRequired: false,
        gateCode: '#4829',
        dropInstructions: 'Front door delivery',
        checkpoints: [
          {
            id: `cp-${Date.now()}`,
            title: 'Optical Barcode Ingestion',
            location: 'Local Scanning Terminal',
            timestamp: 'Just now',
            icon: 'barcode_scanner',
            isCompleted: true,
            isCurrent: true,
          },
        ],
      };
      setPackages([scannedPkg, ...packages]);
      handleSelectPackage(scannedPkg);
      showToast(`Scanned and added tracking: ${scannedCode}`);
    }
  };

  const handlePreSignConfirm = (signerName: string) => {
    if (!packageForPreSign) return;
    setPackages((prev) =>
      prev.map((p) =>
        p.id === packageForPreSign.id ? { ...p, isPreSigned: true } : p
      )
    );
    if (selectedPackage && selectedPackage.id === packageForPreSign.id) {
      setSelectedPackage({ ...selectedPackage, isPreSigned: true });
    }
    showToast(`Signature verified for ${signerName}. Pre-clearance recorded!`);
  };

  const handleUpdateProtocol = (gateCode: string, instructions: string) => {
    if (!selectedPackage) return;
    const updated = {
      ...selectedPackage,
      gateCode,
      dropInstructions: instructions,
    };
    setSelectedPackage(updated);
    setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsManageDeliveryOpen(false);
    showToast('Delivery protocol updated');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface antialiased flex flex-col justify-between selection:bg-primary-container selection:text-on-primary-container">
      {/* Centered tactical mobile container with responsive canvas */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-surface relative flex flex-col shadow-2xl border-x border-surface-container-high/40">
        {/* Top Header */}
        <Header
          currentTab={selectedPackage ? 'package-details' : currentTab}
          onNavigate={handleNavigateTab}
          onBack={handleBackFromDetails}
          unreadCount={notifications.length}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onShare={() => {
            if (selectedPackage) {
              navigator.clipboard?.writeText(selectedPackage.trackingNumber);
              showToast(`Tracking code ${selectedPackage.trackingNumber} copied`);
            }
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 pt-16 min-h-[calc(100vh-4rem)]">
          {selectedPackage ? (
            <PackageDetailsScreen
              packageItem={selectedPackage}
              onNavigateTab={handleNavigateTab}
              onOpenManageDelivery={() => setIsManageDeliveryOpen(true)}
              onCallCourier={() => setIsCallCourierOpen(true)}
              onEditGateCode={() => setIsManageDeliveryOpen(true)}
              onToast={showToast}
            />
          ) : currentTab === 'home' ? (
            <HomeScreen
              packages={packages}
              onSelectPackage={handleSelectPackage}
              onNavigateTab={handleNavigateTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenDropInstructions={(pkg) => {
                setSelectedPackage(pkg);
                setIsManageDeliveryOpen(true);
              }}
              onToast={showToast}
            />
          ) : currentTab === 'live-map' ? (
            <LiveMapScreen
              onCallCourier={() => setIsCallCourierOpen(true)}
              onOpenInstructions={() => {
                const pkg = packages.find((p) => p.id === 'pkg-sony-wh1000xm5') || packages[0];
                setSelectedPackage(pkg);
                setIsManageDeliveryOpen(true);
              }}
              onChangeDropOff={() => {
                showToast('Drop-off rerouting options available for next 8 mins');
              }}
              onLeaveWithNeighbor={() => {
                showToast('Neighbor drop-off authorized for Stop 16 (Apt 4A / Apt 4C)');
              }}
              onToast={showToast}
            />
          ) : currentTab === 'shipments' ? (
            <ShipmentsScreen
              packages={packages}
              onSelectPackage={handleSelectPackage}
              onNavigateTab={handleNavigateTab}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenScanner={() => setIsScannerOpen(true)}
              onOpenPreSign={(pkg) => {
                setPackageForPreSign(pkg);
                setIsPreSignOpen(true);
              }}
              onOpenProofModal={(pkg) => {
                setPackageForProof(pkg);
                setIsProofModalOpen(true);
              }}
              onOpenDeliveryPreferences={(pkg) => {
                setSelectedPackage(pkg);
                setIsManageDeliveryOpen(true);
              }}
              onToast={showToast}
            />
          ) : (
            <ProfileScreen onToast={showToast} />
          )}
        </main>

        {/* Bottom Navigation (Hidden on Package Details as seen in Image 7 & 8) */}
        {!selectedPackage && (
          <BottomNav currentTab={currentTab} onSelectTab={handleNavigateTab} />
        )}
      </div>

      {/* Interactive Global Toast Notification matching HTML */}
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 bg-surface-bright/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.8)] border border-outline-variant/30 flex items-center gap-2 text-primary text-[13px] font-label-telemetry transition-all duration-300 z-50 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
        <span className="text-on-surface font-medium">{toastMessage}</span>
      </div>

      {/* Modals & Sheets */}
      <AddPackageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPackage}
        onToast={showToast}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanResult={handleScanResult}
      />

      {packageForPreSign && (
        <PreSignModal
          packageItem={packageForPreSign}
          isOpen={isPreSignOpen}
          onClose={() => {
            setIsPreSignOpen(false);
            setPackageForPreSign(null);
          }}
          onConfirm={handlePreSignConfirm}
        />
      )}

      {packageForProof && (
        <ProofModal
          packageItem={packageForProof}
          isOpen={isProofModalOpen}
          onClose={() => {
            setIsProofModalOpen(false);
            setPackageForProof(null);
          }}
        />
      )}

      {selectedPackage && (
        <ManageDeliveryModal
          packageItem={selectedPackage}
          isOpen={isManageDeliveryOpen}
          onClose={() => setIsManageDeliveryOpen(false)}
          onUpdateInstructions={handleUpdateProtocol}
          onPreSign={() => {
            setPackageForPreSign(selectedPackage);
            setIsPreSignOpen(true);
          }}
          onToast={showToast}
        />
      )}

      <CallCourierModal
        isOpen={isCallCourierOpen}
        onClose={() => setIsCallCourierOpen(false)}
        courierName="Elena Rostova"
        vehicle="Electric Transit Van #402"
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onClear={() => {
          setNotifications([]);
          showToast('All notifications marked as read');
        }}
      />
    </div>
  );
}
