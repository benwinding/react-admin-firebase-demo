import React from "react";
import { required, TextInput, ImageInput, ImageField } from "react-admin";

import QuickCreateButton from "./QuickCreateButton";
import ReferenceWithQuickCreate from "./ReferenceWithQuickCreate";
import { MyImageField } from "./MyImageField";

const ImageQuickCreateButton = ({ source }) => (
  <QuickCreateButton
    resource="images"
    title="上傳圖片"
    ariaLabel="Create image"
    source={source}
    fields={["name", "image"]}
  >
    <TextInput label="名稱" source="name" validate={required()} />
    <ImageInput label="圖片" source="image" validate={required()}>
      <ImageField source="src" title="name" />
    </ImageInput>
  </QuickCreateButton>
);

const ImageReferenceInput = (props) => (
  <ReferenceWithQuickCreate
    {...props}
    quickCreate={ImageQuickCreateButton}
    preview={<MyImageField source="image.src" />}
  />
);

export default ImageReferenceInput;
