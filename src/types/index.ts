export interface MaintenanceItemType {
  id: string;
  name: string;
  defaultInterval: number;
  currentInterval?: number;
  lastServiceMileage: number;
}

export interface Vehicle {
  id: string;
  modelId: string;
  name: string;
  odometer: number;
  maintenanceItems: MaintenanceItemType[];
}

export interface VehicleModel {
  id: string;
  name: string;
  defaultItems: Omit<MaintenanceItemType, 'lastServiceMileage' | 'currentInterval'>[];
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}
