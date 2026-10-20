import React from "react";
import { required, TextInput } from "react-admin";

import QuickCreateButton from "./QuickCreateButton";
import ReferenceWithQuickCreate from "./ReferenceWithQuickCreate";
import { CoordinateInput } from "./coordinates";

const LocationQuickCreateButton = ({ source }) => (
  <QuickCreateButton
    resource="locations"
    title="建立地點"
    ariaLabel="Create location"
    source={source}
    fields={["name", "latLng", "lat", "lon", "description"]}
  >
    <TextInput label="名稱" validate={required()} source="name" fullWidth />
    <CoordinateInput />
    <TextInput label="說明" source="description" fullWidth />
  </QuickCreateButton>
);

const LocationReferenceInput = (props) => (
  <ReferenceWithQuickCreate
    {...props}
    quickCreate={LocationQuickCreateButton}
  />
);

export default LocationReferenceInput;
