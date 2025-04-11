export const INVENTORY_CATEGORIES = [
  'Implant & Abutment Components',
  'Consumables & Disposables',
  'Impression & Matrix Materials',
  'Local Anesthetics & Pharmaceuticals',
  'Restorative Materials & Bonding Agents',
  'Endodontic & Irrigation Supplies',
  'Etching, Polishing & Bleaching Agents',
  'Surgical & Sterilization Supplies',
  'Dental Instruments & Accessories',
  'Cleaning, Disinfection & Maintenance Supplies',
  'Office & Miscellaneous Supplies'
] as const;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
};

export const STOCK_THRESHOLDS = {
  LOW: 5,
  CRITICAL: 2,
};

export const EXPIRY_THRESHOLDS = {
  WARNING_DAYS: 30,
  CRITICAL_DAYS: 7,
}; 