import * as React from "react";
import { useFormContext } from "react-hook-form";

import {
  NumberInput,
  TextInput,
  required,
  number,
  useRecordContext,
} from "react-admin";

import { longInputSx } from "./actionCommon";

const validateCoordinate = [required(), number()];

export const CoordinateInput = () => {
  const { getValues, setValue } = useFormContext();
  function handleLatLngChange(event) {
    const parts = event.target.value.replace(" ", "").split(",");
    if (parts.length == 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setValue("lat", parts[0], { shouldDirty: true });
      setValue("lon", parts[1], { shouldDirty: true });
    }
  }
  const { lat, lon } = getValues();
  const initialLatLng = lat && lon ? lat + "," + lon : "0,0";

  return (
    <>
      <span>
        <TextInput
          source="latLng"
          label="經緯度"
          onChange={handleLatLngChange}
          defaultValue={initialLatLng}
          sx={longInputSx}
        />
        <br />
        <NumberInput
          source="lat"
          label="緯度"
          validate={validateCoordinate}
          readOnly
        />
        &nbsp;
        <NumberInput
          source="lon"
          label="經度"
          validate={validateCoordinate}
          readOnly
        />
      </span>
    </>
  );
};

export const CoordinateField = () => {
  const record = useRecordContext() || {};
  return (
    <span>
      {record["lat"]},{record["lon"]}
    </span>
  );
};
