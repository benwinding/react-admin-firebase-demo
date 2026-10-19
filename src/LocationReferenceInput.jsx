import React, { useState, useCallback } from "react";
import {
  ReferenceInput,
  AutocompleteInput,
  useWrappedSource,
} from "react-admin";
import { Box } from "@mui/material";

import LocationQuickCreateButton from "./LocationQuickCreateButton";

export const referenceRowSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyItems: "flex-start",
  justifyContent: "flex-start",
  flexDirection: "row",
};

// label and validate belong to the inner input since react-admin v4
const LocationReferenceInput = ({ label, validate, ...props }) => {
  const [version, setVersion] = useState(0);
  const handleChange = useCallback(() => setVersion(version + 1), [version]);
  const finalSource = useWrappedSource(props.source);
  return (
    <div>
      <Box sx={referenceRowSx}>
        <ReferenceInput key={version} {...props}>
          <AutocompleteInput
            optionText="name"
            label={label}
            validate={validate}
          />
        </ReferenceInput>

        <LocationQuickCreateButton
          onChange={handleChange}
          source={finalSource}
        />
      </Box>
      <br />
    </div>
  );
};

export default LocationReferenceInput;
