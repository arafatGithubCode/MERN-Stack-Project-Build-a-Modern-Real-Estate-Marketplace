import { useEffect, useRef, useState } from "react";
import { app } from "../../firebase.js";

import { useSelector } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  return (
    <section>
      <h1 className="text-center font-semibold my-7 text-xl">Profile</h1>
      <form className="flex flex-col gap-3 p-4 max-w-2xl mx-auto">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full w-24 h-24 self-center mb-5"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-600">
              Error image upload(image must be less then 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span>{`uploading ${filePerc} %`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-600">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          className="p-3 rounded-lg shadow"
          placeholder="username"
          type="text"
          id="username"
          value={currentUser.username}
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="email"
          type="email"
          id="email"
          value={currentUser.email}
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="password"
          type="password"
          id="password"
        />
        <button
          className="bg-slate-700 uppercase p-3 rounded-lg text-md hover:opacity-95 disabled:opacity-80 text-white"
          type="submit"
        >
          update
        </button>
      </form>
      <div className="flex justify-between text-red-600 p-3">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </section>
  );
};

export default Profile;
