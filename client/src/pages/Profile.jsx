import { useEffect, useRef, useState } from "react";
import { app } from "../../firebase.js";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutUserStart,
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorShowListings, setErrorShowListings] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();

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
        dispatch(deleteUserFailure(data.message));
      }
      localStorage.removeItem("user");
      dispatch(deleteUserSuccess(data));
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setErrorShowListings(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setErrorShowListings(true);
        return;
      }
      setUserListings(data);
      console.log(userListings);
    } catch (error) {
      setErrorShowListings(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
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
        <Link
          className="bg-green-700 p-3 text-center rounded-lg text-white hover:opacity-95 uppercase"
          to="/create-listing"
        >
          Create Listing
        </Link>
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
      <button
        onClick={handleShowListings}
        className="w-full text-green-700 mb-7"
        type="button"
      >
        Show Listings
      </button>
      <p>{errorShowListings ? "Error showing listings" : ""}</p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-6 p-3">
          <h1 className="text-center font-semibold text-xl">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              className="flex gap-2 justify-between items-center p-3 border border-gray-300 rounded"
              key={listing._id}
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="w-[5rem] object-contain"
                  src={listing.imageUrls[0]}
                  alt="Image"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="font-semibold text-md hover:underline truncate flex-1"
              >
                {listing.name}
              </Link>
              <div className="flex flex-col">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-600 uppercase"
                  type="button"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase" type="button">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Profile;
