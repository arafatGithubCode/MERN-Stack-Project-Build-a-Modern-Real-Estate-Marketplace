import { useEffect, useRef, useState } from "react";
import { app } from "../../firebase.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signoutUserStart,
  signInSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      dispatch(signInSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <section>
      <h1 className="text-center font-semibold my-7 text-xl">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 max-w-2xl mx-auto"
      >
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
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="email"
          type="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          className="p-3 rounded-lg shadow"
          placeholder="password"
          type="password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 uppercase p-3 rounded-lg text-md hover:opacity-95 disabled:opacity-80 text-white"
          type="submit"
        >
          {loading ? "loading..." : "update"}
        </button>
      </form>
      <div className="flex justify-between text-red-600 p-3">
        <span onClick={handleDeleteUser} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully!" : ""}
      </p>
    </section>
  );
};

export default Profile;
