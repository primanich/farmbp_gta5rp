import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function saveProgress(uid: string, tasks: any, totalPoints: number, todayPoints: number) {
  await setDoc(doc(db, "progress", uid), {
    tasks,
    totalPoints,
    todayPoints,
    updatedAt: Date.now()
  });
}

export async function loadProgress(uid: string) {
  const snap = await getDoc(doc(db, "progress", uid));
  return snap.exists() ? snap.data() : null;
}
