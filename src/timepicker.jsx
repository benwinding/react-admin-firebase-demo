import React from "react";
import { TextInput } from "react-admin";

function TimeInput(props) {
  const { source, label } = props;
  return (
    <TextInput
      source={source}
      label={label}
      type="time"
      min="00:00"
      sx={{ width: 200 }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}

export default TimeInput;
