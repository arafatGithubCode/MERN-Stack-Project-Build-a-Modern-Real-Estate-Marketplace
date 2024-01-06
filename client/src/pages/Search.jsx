import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  console.log(listings && listings);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sell" ||
      e.target.id === "rent"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    console.log(urlParams);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 p-7 border-b-2 md:border-r-2 md:min-h-screen"
      >
        <div className="flex items-center gap-1">
          <label
            className="text-slate-800 whitespace-nowrap font-semibold"
            htmlFor="search_term"
          >
            Search Term:{" "}
          </label>
          <input
            className="p-3 rounded-lg border w-full"
            type="text"
            placeholder="Search...."
            id="searchTerm"
            value={sidebarData.searchTerm}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="font-semibold">Type: </label>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="all"
              onChange={handleChange}
              checked={sidebarData.type === "all"}
            />
            <span>Rent & Sell</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="rent"
              onChange={handleChange}
              checked={sidebarData.type === "rent"}
            />
            <span>Rent</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="sell"
              onChange={handleChange}
              checked={sidebarData.type === "sell"}
            />
            <span>Sell</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="offer"
              onChange={handleChange}
              checked={sidebarData.offer}
            />
            <span>Offer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="font-semibold whitespace-nowrap">Amenities: </label>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="parking"
              onChange={handleChange}
              checked={sidebarData.parking}
            />
            <span>Parking</span>
          </div>
          <div className="flex gap-2">
            <input
              className="w-5"
              type="checkbox"
              id="furnished"
              onChange={handleChange}
              checked={sidebarData.furnished}
            />
            <span>Furnished</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort_order" className="font-semibold">
            Sort:{" "}
          </label>
          <select
            onChange={handleChange}
            defaultValue={"created_at_desc"}
            className="border rounded-lg p-3"
            id="sort_order"
          >
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to high</option>
            <option value="createdAt_desc">Latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>
        <button
          className="text-white bg-slate-700 rounded-lg hover:opacity-95 disabled:opacity-85 p-3 uppercase"
          type="submit"
        >
          search
        </button>
      </form>
      <div className="flex-1">
        <h2 className="font-semibold text-2xl border-b-2 p-3 mt-5">
          Listing results
        </h2>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-lg text-slate-700">No listing found</p>
          )}
          {loading && (
            <p className="w-full text-center text-slate-700 text-xl font-semibold">
              Loading
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
