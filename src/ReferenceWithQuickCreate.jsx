import React from "react";
import { useWatch } from "react-hook-form";
import {
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  useWrappedSource,
} from "react-admin";
import { Box } from "@mui/material";

const rowSx = {
  display: "inline-flex",
  alignItems: "center",
  justifyItems: "flex-start",
  justifyContent: "flex-start",
  flexDirection: "row",
};

// A ReferenceInput with a quick-create button next to it and an optional
// preview of the selected record. label and validate belong to the inner
// input since react-admin v4; allowEmpty is a v3 prop (Autocomplete can be cleared).
const ReferenceWithQuickCreate = ({
  label,
  validate,
  allowEmpty,
  quickCreate: QuickCreate,
  preview,
  ...props
}) => {
  const finalSource = useWrappedSource(props.source);
  const value = useWatch({ name: finalSource });
  return (
    <div>
      <Box sx={rowSx}>
        <ReferenceInput {...props}>
          <AutocompleteInput
            optionText="name"
            label={label}
            validate={validate}
          />
        </ReferenceInput>
        <QuickCreate source={finalSource} />
      </Box>
      <br />
      {preview && (
        <>
          <ReferenceField
            record={{ id: finalSource, value }}
            source="value"
            reference={props.reference}
          >
            {preview}
          </ReferenceField>
          <br />
        </>
      )}
    </div>
  );
};

export default ReferenceWithQuickCreate;
