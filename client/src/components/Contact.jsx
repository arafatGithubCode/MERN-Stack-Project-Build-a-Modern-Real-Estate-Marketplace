import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            <span className="text-md font-semibold">Contact </span>to{" "}
            <span className="text-md font-semibold text-yellow-500">
              {landlord.username}{" "}
            </span>
            for <span className="text-sm lowercase">{listing.name}</span>
          </p>
          <textarea
            onChange={onChange}
            value={message}
            className="p-3 rounded-lg border border-gray-300 w-full"
            placeholder="Enter your message here..."
            id="message"
            rows="2"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 p-3 w-full rounded-lg text-white uppercase text-center hover:opacity-95 disabled:opacity-80"
          >
            send message
          </Link>
        </div>
      )}
    </>
  );
};

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default Contact;
