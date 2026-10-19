import React, { useState, useCallback } from "react";
import { useWatch } from "react-hook-form";
import {
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  useWrappedSource,
} from "react-admin";
import { Box } from "@mui/material";

import ImageQuickCreateButton from "./ImageQuickCreateButton";
import { MyImageField } from "./MyImageField";
import { referenceRowSx } from "./LocationReferenceInput";

// allowEmpty is a v3 prop; AutocompleteInput can always be cleared
const ImageReferenceInput = ({ label, validate, allowEmpty, ...props }) => {
  const [version, setVersion] = useState(0);
  const handleChange = useCallback(() => setVersion(version + 1), [version]);
  const finalSource = useWrappedSource(props.source);
  const value = useWatch({ name: finalSource });

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
        <ImageQuickCreateButton onChange={handleChange} source={finalSource} />
      </Box>
      <br />
      <ReferenceField
        key={version}
        label="image"
        record={{ id: finalSource, value }}
        source="value"
        reference="images"
      >
        <MyImageField source="image.src" />
      </ReferenceField>
      <br />
    </div>
  );
};

export default ImageReferenceInput;
