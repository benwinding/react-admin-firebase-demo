import * as React from "react";
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
  FileField,
  FileInput,
  required,
  useRecordContext,
} from "react-admin";
import { getDeleteButton } from "./deleteResource";

import { DummyList } from "./dummy";
const mapStyleFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{localStorage.getItem("scenarioName")}》地圖樣式
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const MapStyleDelete = (props) => {
  const paths = ["mapStyle"];
  return getDeleteButton(props, "mapStyles", "地圖樣式", paths.join(","));
};

export const MapStyleList = () => {
  if (localStorage.getItem("scenario")) {
    return (
      <List
        title={<Title />}
        perPage={100}
        sort={{ field: "name", order: "ASC" }}
        filters={mapStyleFilters}
      >
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <FileField label="地圖樣式" source="mapStyle.src" title={"連結"} />
          <EditButton label="" />
          <MapStyleDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  } else return <DummyList />;
};

export const MapStyleCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" />
      <FileInput label="地圖樣式" source="mapStyle" validate={required()}>
        <FileField source="src" title="name" />
      </FileInput>
    </SimpleForm>
  </Create>
);

export const MapStyleEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <TextInput label="名稱" source="name" />
      <FileInput label="地圖樣式" source="mapStyle" validate={required()}>
        <FileField source="src" title="name" />
      </FileInput>
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
    </SimpleForm>
  </Edit>
);
