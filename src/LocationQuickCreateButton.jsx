import React from "react";
import { required, TextInput } from "react-admin";

import QuickCreateButton from "./QuickCreateButton";
import { CoordinateInput } from "./coordinates";

function LocationQuickCreateButton({ onChange, source }) {
  return (
    <QuickCreateButton
      resource="locations"
      title="建立地點"
      ariaLabel="Create location"
      source={source}
      onChange={onChange}
    >
      <TextInput label="名稱" validate={required()} source="name" fullWidth />
      <CoordinateInput />
      <TextInput label="說明" source="description" fullWidth />
    </QuickCreateButton>
  );
}

export default LocationQuickCreateButton;
