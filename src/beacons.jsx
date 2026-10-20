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
  required,
  useRecordContext,
} from "react-admin";
import { getDeleteButton } from "./deleteResource";
import { DummyList } from "./dummy";
import { getCurrentScenario, getCurrentScenarioName } from "./currentScenario";

const beaconFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{getCurrentScenarioName()}》Beacon
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const BeaconDelete = (props) => {
  const paths = ["beacon"];
  return getDeleteButton(props, "beacons", "beacon", paths.join(","));
};

export const BeaconList = () => {
  if (getCurrentScenario())
    return (
      <List title={<Title />} filters={beaconFilters}>
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <TextField label="Beacon ID" source="beaconId" />
          <TextField label="說明" source="description" />
          <EditButton label="" />
          <BeaconDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  else return <DummyList />;
};

export const BeaconCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" validate={required()} />
      <TextInput label="Beacon ID" source="beaconId" validate={required()} />
      <TextInput label="說明" source="description" />
    </SimpleForm>
  </Create>
);

export const BeaconEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
      <TextInput label="名稱" source="name" validate={required()} />
      <TextInput label="Beacon ID" source="beaconId" validate={required()} />
      <TextInput label="說明" source="description" />
    </SimpleForm>
  </Edit>
);
