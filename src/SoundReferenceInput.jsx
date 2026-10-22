import React from "react";
import { required, TextInput, FileInput, FileField } from "react-admin";

import QuickCreateButton from "./QuickCreateButton";
import ReferenceWithQuickCreate from "./ReferenceWithQuickCreate";

const SoundQuickCreateButton = ({ source }) => (
  <QuickCreateButton
    resource="sounds"
    title="上傳音檔"
    ariaLabel="Upload Sound"
    source={source}
    fields={["name", "sound"]}
  >
    <TextInput label="名稱" source="name" validate={required()} />
    <FileInput label="音檔" source="sound" validate={required()}>
      <FileField source="src" title="name" />
    </FileInput>
  </QuickCreateButton>
);

const SoundReferenceInput = (props) => (
  <ReferenceWithQuickCreate
    {...props}
    quickCreate={SoundQuickCreateButton}
    preview={<FileField title={"音檔"} source="sound.src" />}
  />
);

export default SoundReferenceInput;
