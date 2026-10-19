import React from "react";
import { required, TextInput, FileInput, FileField } from "react-admin";

import QuickCreateButton from "./QuickCreateButton";

function SoundQuickCreateButton({ onChange, source }) {
  return (
    <QuickCreateButton
      resource="sounds"
      title="上傳音檔"
      ariaLabel="Upload Sound"
      source={source}
      onChange={onChange}
    >
      <TextInput label="名稱" source="name" validate={required()} />
      <FileInput label="音檔" source="sound" validate={required()}>
        <FileField source="src" title="name" />
      </FileInput>
    </QuickCreateButton>
  );
}

export default SoundQuickCreateButton;
