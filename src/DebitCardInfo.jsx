import { useState, useRef, useEffect } from "react";
import AddressComponent, { INITIAL_ADDRESS } from "./common/AddressComponent";
import {
  getDebitCardDetails,
  updateDebitCardDetails,
  getBusinessDetails,
  getPersonalDetails
} from "./api.service";

function DebitCardInfo(props) {
  const addressRef = useRef(null);

  const [nameToBePrinted, setNameToBePrinted] = useState("");

  const [previousAddresses, setPreviousAddresses] = useState({
    personal: null,
    business: null
  });

  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [error, setError] = useState("");

  const updateAddress = (newValue) => {
    const sameAsP = newValue.isSameAsPersonal;
    const sameAsB = newValue.isSameAsBusiness;
    if (sameAsP || (sameAsB && previousAddresses.business.isSameAsPersonal)) {
      setAddress(() => ({ ...previousAddresses.personal, ...newValue }));
    } else if (sameAsB) {
      setAddress(() => ({ ...previousAddresses.business, ...newValue }));
    } else {
      setAddress((curr) => ({ ...curr, ...newValue }));
    }
  };

  const save = () => {
    const data = {
      nameToBePrinted,
      ...address
    };

    return updateDebitCardDetails(data);
  };

  const validateInputs = () => {
    const validAddress = addressRef.current.validate();

    if (!nameToBePrinted) {
      setError("Name To Be Printed is required");
    } else {
      setError("");
    }
    return nameToBePrinted && validAddress;
  };

  const saveInfo = () => {
    if (validateInputs()) {
      save().then((res) => {
        if (res.status === "success") {
          props.onNext();
        }
      });
    }
  };

  const getPreviousAddresses = () => {
    Promise.all([getBusinessDetails(), getPersonalDetails()]).then((res) => {
      setPreviousAddresses({
        personal: res[1],
        business: res[0]
      });
    });
  };

  useEffect(() => {
    getPreviousAddresses();
    getDebitCardDetails().then((data) => {
      if (data) {
        const addressObject = {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          isSameAsBusiness: data.isSameAsBusiness,
          isSameAsPersonal: data.isSameAsPersonal
        };
        setAddress(addressObject);
        setNameToBePrinted(data.nameToBePrinted);
      }
    });
  }, []);

  return (
    <>
      <div className="max-w-xl rounded overflow-hidden shadow-lg p-8 border m-auto mt-12">
        <h1 className="my-2">Debit Card Info</h1>
        <hr></hr>
        <div className="md:flex md:items-center mb-4 mt-2">
          <div className="md:w-1/3">
            <label className="text-sm">Name To Be Printed</label>
          </div>
          <div className="md:w-2/3">
            <input
              className="border rounded"
              type="text"
              value={nameToBePrinted}
              onInput={(e) => setNameToBePrinted(e.target.value)}
            ></input>
            {error && <p className="text-red-500 text-xs italic ">{error}</p>}
          </div>
        </div>{" "}
        <AddressComponent
          showSameAsPersonal
          showSameAsBusiness
          inputRef={addressRef}
          value={address}
          updateAddress={(value) => updateAddress(value)}
        />
        <div>
          <button
            onClick={() => props.onBack()}
            className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2 mr-5"
          >
            Back
          </button>
          <button
            onClick={() => saveInfo()}
            className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default DebitCardInfo;
