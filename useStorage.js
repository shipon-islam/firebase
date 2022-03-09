import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase/Db";

export default function useStorage(filepath, cat) {
  const [progress, setprogrss] = useState(0);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    if (filepath && cat) {
      const storageRef = ref(storage, `/images/${filepath.name}`);
      const collectionRef = collection(db, "potfolio");
      const uploadtask = uploadBytesResumable(storageRef, filepath);
      uploadtask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setprogrss(prog);
        },
        (err) => setError(err),
        async () => {
          const url = await getDownloadURL(uploadtask.snapshot.ref);
          await addDoc(collectionRef, { imageUrl: url, catagory: cat });
          setImageUrl(url);
        }
      );
    }
  }, [filepath, cat]);

  return { imageUrl, error, progress };
}
