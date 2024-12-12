import React, { useState } from "react";
import PredictSection from "./PredictSection";

function Parent() {
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isPredictLoading, setIsPredictLoading] = useState(false);


  return (
    <div>
      <PredictSection isPredictLoading={isPredictLoading} setIsPredictLoading={setIsPredictLoading} isUploadLoading={isUploadLoading}/>
    </div>
  );
}

export default Parent;