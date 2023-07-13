import { useState } from "react";
import "./App.css";
import PersonalInfo from "./PersonalInfo";
import BusinessInfo from "./BusinessInfo";
import DebitCardInfo from "./DebitCardInfo";
import ReviewDetails from "./ReviewDetails";

function App() {
  const [stepCounter, setStepCounter] = useState(0);

  const updateCounter = (val) => {
    setStepCounter((curr) => (curr + val) % 4);
  };

  return (
    <div>
      {/* Step 1 */}
      {stepCounter === 0 && (
        <PersonalInfo onNext={() => updateCounter(+1)}></PersonalInfo>
      )}

      {/* Step 2 */}
      {stepCounter === 1 && (
        <BusinessInfo
          onNext={() => updateCounter(+1)}
          onBack={() => updateCounter(-1)}
        ></BusinessInfo>
      )}

      {/* Step 3 */}
      {stepCounter === 2 && (
        <DebitCardInfo
          onNext={() => updateCounter(+1)}
          onBack={() => updateCounter(-1)}
        ></DebitCardInfo>
      )}

      {/* Review screen */}
      {stepCounter === 3 && (
        <ReviewDetails
          onNext={() => updateCounter(+1)}
          onBack={() => updateCounter(-1)}
        ></ReviewDetails>
      )}
    </div>
  );
}

export default App;
