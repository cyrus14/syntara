import React, { useState } from "react";
import UploadSection from "./UploadSection";
import PredictSection from "./PredictSection";

function Parent() {
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [isPredictLoading, setIsPredictLoading] = useState(false);


  return (
    <div>
      <UploadSection isUploadLoading={isUploadLoading} setIsUploadLoading={setIsUploadLoading} isPredictLoading={isPredictLoading}/> 
      <PredictSection isPredictLoading={isPredictLoading} setIsPredictLoading={setIsPredictLoading} isUploadLoading={isUploadLoading}/>
    </div>
  );
}

export default Parent;