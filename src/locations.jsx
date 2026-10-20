import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  EditButton,
  DateTimeInput,
  useRecordContext,
} from "react-admin";

import { getDeleteButton } from "./deleteResource";
import { CoordinateInput, CoordinateField } from "./coordinates";
import { DummyList } from "./dummy";
import { getCurrentScenario, getCurrentScenarioName } from "./currentScenario";

const locationFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{getCurrentScenarioName()}》地點
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const LocationDelete = (props) => {
  const paths = ["soundCenterId", "locationId", "geofenceCenter"];
  return getDeleteButton(props, "locations", "地點", paths.join(","));
};

export const LocationList = () => {
  if (getCurrentScenario()) {
    return (
      <List
        title={<Title />}
        sort={{ field: "name", order: "ASC" }}
        perPage={100}
        filters={locationFilters}
      >
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <CoordinateField label="座標" source="coordinates" />
          <TextField label="說明" source="description" />
          <EditButton label="" />
          <LocationDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  } else return <DummyList />;
};

export const LocationShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <CoordinateField source="coordinates" label="Coordinates" />
      <TextField multiline source="description" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
    </SimpleShowLayout>
  </Show>
);

export const LocationCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" />
      <CoordinateInput />
      <TextInput label="說明" source="description" />
    </SimpleForm>
  </Create>
);

export const LocationEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
      <TextInput label="名稱" source="name" />
      <CoordinateInput />
      <TextInput label="說明" source="description" />
    </SimpleForm>
  </Edit>
);
