// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Create,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  EditButton,
  DateTimeInput,
  ImageInput,
  required,
  useRecordContext,
} from "react-admin";

import { MyImageField } from "./MyImageField";
import { DummyList } from "./dummy";
import { getCurrentScenario, getCurrentScenarioName } from "./currentScenario";
import { getDeleteButton } from "./deleteResource";

const imageFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{getCurrentScenarioName()}》圖片
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

export const ImageList = () => {
  if (getCurrentScenario()) {
    return (
      <List title={<Title />} filters={imageFilters}>
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <MyImageField label="圖片" source="image.src" />
          <EditButton label="" />
          <ImageDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  } else return <DummyList />;
};

const ImageDelete = (props) => {
  const paths = [
    "pictures.pictureId",
    "introBackground",
    "introLogo",
    "mapLogo",
    "portrait",
    "markerIcon",
    "guideImage",
  ];
  return getDeleteButton(props, "images", "圖片", {
    actions: paths,
    broadcasts: paths,
    people: ["userPortrait"],
    scenarios: ["pictureId"],
  });
};

export const ImageCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" />
      <ImageInput label="圖片" source="image" validate={required()}>
        <MyImageField source="src" title="name" />
      </ImageInput>
      <>(圖釘建議大小： 150 x 150)</>
    </SimpleForm>
  </Create>
);

export const ImageEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <TextInput label="名稱" source="name" />
      <ImageInput label="圖片" source="image" validate={required()}>
        <MyImageField source="src" title="name" />
      </ImageInput>
      <>(圖釘建議大小： 150 x 150)</>
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
    </SimpleForm>
  </Edit>
);
