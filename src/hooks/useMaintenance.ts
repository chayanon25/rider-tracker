import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  query
} from 'firebase/firestore';
import type { Vehicle, MaintenanceItemType } from '../types';
import { VEHICLE_MODELS } from '../data/vehicles';

export function useMaintenance(userId: string | undefined) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync vehicles from Firestore
  useEffect(() => {
    if (!userId) {
      setVehicles([]);
      setActiveVehicleId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'users', userId, 'vehicles'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicleList: Vehicle[] = [];
      snapshot.forEach((docSnap) => {
        vehicleList.push({ id: docSnap.id, ...docSnap.data() } as Vehicle);
      });
      
      setVehicles(vehicleList);
      
      // Auto-select active vehicle
      if (vehicleList.length > 0) {
        const savedActiveId = localStorage.getItem(`active_vehicle_${userId}`);
        if (savedActiveId && vehicleList.some(v => v.id === savedActiveId)) {
          setActiveVehicleId(savedActiveId);
        } else {
          setActiveVehicleId(vehicleList[0].id);
        }
      } else {
        setActiveVehicleId(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error syncing vehicles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const selectActiveVehicle = (id: string) => {
    if (userId) {
      setActiveVehicleId(id);
      localStorage.setItem(`active_vehicle_${userId}`, id);
    }
  };

  const addVehicle = async (modelId: string, customName: string, initialOdo: number) => {
    if (!userId) return;

    const model = VEHICLE_MODELS.find(m => m.id === modelId);
    if (!model) return;

    const newVehicleRef = doc(collection(db, 'users', userId, 'vehicles'));
    
    const maintenanceItems: MaintenanceItemType[] = model.defaultItems.map(item => ({
      ...item,
      lastServiceMileage: 0
    }));

    const newVehicle: Omit<Vehicle, 'id'> = {
      modelId,
      name: customName,
      odometer: initialOdo,
      maintenanceItems
    };

    await setDoc(newVehicleRef, newVehicle);
    selectActiveVehicle(newVehicleRef.id);
  };

  const updateOdometer = async (odo: number) => {
    if (!userId || !activeVehicleId) return;
    const vehicleRef = doc(db, 'users', userId, 'vehicles', activeVehicleId);
    await updateDoc(vehicleRef, { odometer: odo });
  };

  const logService = async (itemId: string, serviceOdo: number) => {
    if (!userId || !activeVehicleId) return;
    
    const vehicle = vehicles.find(v => v.id === activeVehicleId);
    if (!vehicle) return;

    const updatedItems = vehicle.maintenanceItems.map(item => {
      if (item.id === itemId) {
        return { ...item, lastServiceMileage: serviceOdo };
      }
      return item;
    });

    const vehicleRef = doc(db, 'users', userId, 'vehicles', activeVehicleId);
    const odoUpdate: Record<string, any> = { maintenanceItems: updatedItems };
    if (serviceOdo > vehicle.odometer) {
      odoUpdate.odometer = serviceOdo;
    }

    await updateDoc(vehicleRef, odoUpdate);
  };

  const updateItemInterval = async (itemId: string, newInterval: number) => {
    if (!userId || !activeVehicleId) return;

    const vehicle = vehicles.find(v => v.id === activeVehicleId);
    if (!vehicle) return;

    const updatedItems = vehicle.maintenanceItems.map(item => {
      if (item.id === itemId) {
        return { ...item, currentInterval: newInterval };
      }
      return item;
    });

    const vehicleRef = doc(db, 'users', userId, 'vehicles', activeVehicleId);
    await updateDoc(vehicleRef, { maintenanceItems: updatedItems });
  };

  // Add custom maintenance item
  const addCustomItem = async (name: string, interval: number) => {
    if (!userId || !activeVehicleId) return;

    const vehicle = vehicles.find(v => v.id === activeVehicleId);
    if (!vehicle) return;

    const newItem: MaintenanceItemType = {
      id: `custom-${Date.now()}`,
      name,
      defaultInterval: interval,
      lastServiceMileage: vehicle.odometer
    };

    const updatedItems = [...vehicle.maintenanceItems, newItem];
    const vehicleRef = doc(db, 'users', userId, 'vehicles', activeVehicleId);
    await updateDoc(vehicleRef, { maintenanceItems: updatedItems });
  };

  // Delete maintenance item
  const deleteItem = async (itemId: string) => {
    if (!userId || !activeVehicleId) return;

    const vehicle = vehicles.find(v => v.id === activeVehicleId);
    if (!vehicle) return;

    const updatedItems = vehicle.maintenanceItems.filter(item => item.id !== itemId);
    const vehicleRef = doc(db, 'users', userId, 'vehicles', activeVehicleId);
    await updateDoc(vehicleRef, { maintenanceItems: updatedItems });
  };

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || null;

  return {
    vehicles,
    activeVehicle,
    loading,
    addVehicle,
    selectActiveVehicle,
    updateOdometer,
    logService,
    updateItemInterval,
    addCustomItem,
    deleteItem
  };
}
