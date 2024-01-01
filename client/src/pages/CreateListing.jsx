import { useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [progress, setProgress] = useState(null);
  const [normalFileName, setNormalFileName] = useState("");
  const [formData, setFormData] = useState({
    imageUrls: [],
  });

  const handleImageUpload = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
          setProgress(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
          setProgress(false);
          console.log(err);
        });
    } else {
      setImageUploadError("You can upload only 6 images per listing");
      setUploading(false);
      setProgress(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      setNormalFileName(file.name);
      const fileName = new Date().getTime + file.name;
      const storageRef = ref(storage, `listingImg/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handleRemoveImg = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="text-center my-7 font-semibold text-xl">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row p-3 gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            className="p-3 rounded-lg shadow"
            type="text"
            id="name"
            placeholder="Name"
            required
            minLength={10}
            maxLength={20}
          />
          <textarea
            className="p-3 rounded-lg shadow"
            type="text"
            id="description"
            placeholder="Description"
            required
            minLength={10}
            maxLength={50}
          />
          <input
            className="p-3 rounded-lg shadow"
            type="text"
            id="address"
            placeholder="Address"
            required
            minLength={5}
            maxLength={50}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="sell" />
              <span className="text-lg">Sell</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="rent" />
              <span className="text-lg">Rent</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="parking" />
              <span className="text-lg">Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="furnished" />
              <span className="text-lg">Furnished</span>
            </div>
            <div className="flex gap-2">
              <input className="w-5" type="checkbox" id="offer" />
              <span className="text-lg">Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="w-[6rem] p-3 rounded-lg border-gray-300 border"
                type="number"
                id="bedrooms"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="w-[6rem] p-3 rounded-lg border-gray-300 border"
                type="number"
                id="bathrooms"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                className="p-3 rounded-lg border-gray-300 border"
                type="number"
                id="regularPrice"
                required
              />
              <div className="flex flex-col justify-center items-center">
                <p>Regular price</p>
                <p className="text-xs">($ / Month)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <p>
            <span className="font-semibold text-lg">Images: </span>
            <span className="text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex items-center gap-2 flex-col">
            <div className="flex justify-between gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded-lg w-full"
                type="file"
                accept="image/*"
                multiple
                required
                id="images"
                disabled={uploading}
              />
              <button
                onClick={handleImageUpload}
                disabled={uploading}
                type="button"
                className="uppercase p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-50"
              >
                {uploading ? "uploading..." : "upload"}
              </button>
            </div>
            <p>{progress && `upload is ${progress} % done`}</p>
            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  className="flex justify-between items-center border shadow p-3 w-full"
                  key={url}
                >
                  <div className="flex gap-2">
                    <img
                      className="w-[3rem] rounded-lg"
                      src={url}
                      alt="listing-image"
                    />
                    <span className="text-xs">{normalFileName}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveImg(index)}
                    type="button"
                    className="text-red-600 rounded-lg hover:opacity-80 p-3 uppercase"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <button
            className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-85"
            type="submit"
          >
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
