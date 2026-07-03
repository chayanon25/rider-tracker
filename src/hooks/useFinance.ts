import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import type { Transaction } from '../types';

export function useFinance(userId: string | undefined) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Transaction);
      });
      setTransactions(list);
      setLoading(false);
    }, (error) => {
      console.error("Error syncing transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Add transaction
  const addTransaction = async (type: 'income' | 'expense', category: string, amount: number, date: string, description: string) => {
    if (!userId) return;
    const txRef = doc(collection(db, 'users', userId, 'transactions'));
    const newTx: Transaction = {
      id: txRef.id,
      type,
      category,
      amount,
      date,
      description
    };
    await setDoc(txRef, newTx);
  };

  // Delete transaction
  const deleteTransaction = async (id: string) => {
    if (!userId) return;
    const txRef = doc(db, 'users', userId, 'transactions', id);
    await deleteDoc(txRef);
  };

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction
  };
}
