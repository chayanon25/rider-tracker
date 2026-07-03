import type { VehicleModel } from '../types';

export const VEHICLE_MODELS: VehicleModel[] = [
  {
    id: 'honda-click-125i-2018',
    name: 'Honda Click 125i (2018)',
    defaultItems: [
      { id: 'engine-oil', name: 'น้ำมันเครื่อง', defaultInterval: 3000 },
      { id: 'gear-oil', name: 'น้ำมันเฟืองท้าย', defaultInterval: 6000 },
      { id: 'spark-plug', name: 'หัวเทียน', defaultInterval: 8000 },
      { id: 'air-filter', name: 'ไส้กรองอากาศ', defaultInterval: 12000 },
      { id: 'drive-belt', name: 'ชุดสายพาน/ชาม/เม็ด', defaultInterval: 24000 },
      { id: 'coolant', name: 'น้ำยาหม้อน้ำ', defaultInterval: 24000 },
      { id: 'tires', name: 'ยางหน้า-หลัง', defaultInterval: 10000 },
      { id: 'brakes', name: 'ผ้าเบรก', defaultInterval: 10000 },
    ]
  }
];
