import React, { useState, useCallback } from "react";
import { useWatch } from "react-hook-form";
import {
  ReferenceInput,
  AutocompleteInput,
  FileField,
  ReferenceField,
  useWrappedSource,
} from "react-admin";
import { Box } from "@mui/material";

import SoundQuickCreateButton from "./SoundQuickCreateButton";
import { referenceRowSx } from "./LocationReferenceInput";

const SoundReferenceInput = ({ label, validate, ...props }) => {
  const [version, setVersion] = useState(0);
  const handleChange = useCallback(() => setVersion(version + 1), [version]);
  const finalSource = useWrappedSource(props.source);
  const value = useWatch({ name: finalSource });

  return (
    <>
      <Box sx={referenceRowSx}>
        <ReferenceInput key={version} {...props}>
          <AutocompleteInput
            optionText="name"
            label={label}
            validate={validate}
          />
        </ReferenceInput>
        <SoundQuickCreateButton onChange={handleChange} source={finalSource} />
      </Box>
      <br />
      <ReferenceField
        key={version}
        label="sound"
        record={{ id: finalSource, value }}
        source="value"
        reference="sounds"
      >
        <FileField title={"音檔"} source="sound.src" />
      </ReferenceField>
      <br />
    </>
  );
};

export default SoundReferenceInput;
