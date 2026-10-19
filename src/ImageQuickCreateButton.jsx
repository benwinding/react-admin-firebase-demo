import React from "react";
import { required, TextInput, ImageInput, ImageField } from "react-admin";

import QuickCreateButton from "./QuickCreateButton";

function ImageQuickCreateButton({ onChange, source }) {
  return (
    <QuickCreateButton
      resource="images"
      title="上傳圖片"
      ariaLabel="Create image"
      source={source}
      onChange={onChange}
    >
      <TextInput label="名稱" source="name" validate={required()} />
      <ImageInput label="圖片" source="image" validate={required()}>
        <ImageField source="src" title="name" />
      </ImageInput>
    </QuickCreateButton>
  );
}

export default ImageQuickCreateButton;
