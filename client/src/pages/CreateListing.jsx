const CreateListing = () => {
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
          <div className="flex gap-4 items-center">
            <input
              className="p-3 border border-gray-300 rounded-lg w-full"
              type="file"
              accept="image/*"
              multiple
              required
              id="images"
            />
            <button className="uppercase p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg">
              Upload
            </button>
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
