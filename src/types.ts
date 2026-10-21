export type PackageStatus =
  | 'out_for_delivery'
  | 'in_transit'
  | 'delivered'
  | 'awaiting_pickup'
  | 'exception';

export type CarrierType = 'FedEx' | 'UPS' | 'DHL' | 'USPS' | 'Amazon';

export interface CourierInfo {
  name: string;
  avatar: string;
  rating: number;
  totalDeliveries: string;
  vehicle: string;
  phone: string;
  verified: boolean;
}

export interface MilestoneCheckpoint {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  statusText?: string;
  icon: string;
  isCompleted: boolean;
  isCurrent?: boolean;
  courierDetail?: {
    name: string;
    sub: string;
    avatar: string;
  };
}

export interface PackageItem {
  id: string;
  trackingNumber: string;
  title: string;
  subtitle: string;
  carrier: CarrierType;
  serviceType: string;
  status: PackageStatus;
  statusLabel: string;
  eta: string;
  etaFormatted: string;
  stopsAway?: number;
  progressPercent: number;
  image: string;
  weight: string;
  weightTare: string;
  dimensions: string;
  dimensionsUnit: string;
  originFacility: string;
  originLocation: string;
  destination: string;
  destinationType: string;
  signatureRequired: boolean;
  isPreSigned?: boolean;
  gateCode: string;
  dropInstructions: string;
  vehicleId?: string;
  courier?: CourierInfo;
  checkpoints: MilestoneCheckpoint[];
  proofPhoto?: string;
  historyDateTag?: string;
  isUrgent?: boolean;
}

export interface RouteStop {
  stopNumber: number;
  status: 'DELIVERED' | 'UNLOADING' | 'DESTINATION' | 'UPCOMING';
  statusBadge: string;
  title: string;
  location: string;
  note: string;
  time: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export type TabDestination = 'home' | 'live-map' | 'shipments' | 'profile';
