export interface MeasurementItem {
  standard: string;
  imageUrl: string;
  description: string;
}

export interface MeasurementData {
  [key: string]: MeasurementItem[];
}

export interface MeasurementGuideContentProps {
  activeTab: string | null;
  measurementData: MeasurementData;
}

export interface MeasurementGuideToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export interface MeasurementTabProps {
  activeTab: string | null;
  onTabChange: (tab: string) => void;
}
