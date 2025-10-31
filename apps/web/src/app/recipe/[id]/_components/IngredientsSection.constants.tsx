import React from 'react';

import { PowderIcon, SauceIcon, WaterIcon } from '@/components/Icons';

export interface MeasurementTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export const MEASUREMENT_TABS: MeasurementTab[] = [
  {
    icon: <PowderIcon />,
    id: 'powder',
    label: '가루류',
  },
  {
    icon: <WaterIcon color="#6B7280" />,
    id: 'liquid',
    label: '액체류',
  },
  {
    activeIcon: <SauceIcon color="#111827" />,
    icon: <SauceIcon color="#6B7280" />,
    id: 'sauce',
    label: '장,젓갈류',
  },
];

export const MEASUREMENT_GUIDE_LABELS = {
  liquid: '액체류',
  minced: '다진양념류',
  powder: '가루류',
  sauce: '장류',
} as const;
