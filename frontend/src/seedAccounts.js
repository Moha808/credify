/**
 * ONE-TIME SCRIPT: Creates the Admin and Loan Officer accounts in Firebase.
 * 
 * Run this ONCE in your browser console (F12 > Console) while on the Credify website.
 * After running, these accounts will exist permanently in Firebase.
 * 
 * Admin Login:    admin@credify.com    / Admin@123
 * Officer Login:  officer@credify.com  / Officer@123
 */

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';

const seedAccounts = async () => {
  const accounts = [
    {
      email: 'admin@credify.com',
      password: 'Admin@123',
      name: 'System Administrator',
      role: 'admin'
    },
    {
      email: 'officer@credify.com',
      password: 'Officer@123',
      name: 'Loan Officer',
      role: 'officer'
    }
  ];

  for (const account of accounts) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: account.name,
        email: account.email,
        role: account.role,
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Created: ${account.role} (${account.email})`);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`⚠️ Already exists: ${account.email}`);
      } else {
        console.error(`❌ Error creating ${account.email}:`, error.message);
      }
    }
  }
  console.log('🎉 Seeding complete!');
};

export default seedAccounts;
