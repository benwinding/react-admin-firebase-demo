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
  FileField,
  FileInput,
  required,
  useRecordContext,
} from "react-admin";
import { getDeleteButton } from "./deleteResource";

import { DummyList } from "./dummy";
import { getCurrentScenario, getCurrentScenarioName } from "./currentScenario";
const soundFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{getCurrentScenarioName()}》聲音
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const SoundDelete = (props) => {
  const paths = ["soundId"];
  return getDeleteButton(props, "sounds", "聲音", {
    actions: paths,
    broadcasts: paths,
  });
};

export const SoundList = () => {
  if (getCurrentScenario()) {
    return (
      <List
        title={<Title />}
        perPage={100}
        sort={{ field: "name", order: "ASC" }}
        filters={soundFilters}
      >
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <FileField label="音檔" source="sound.src" title={"連結"} />
          <EditButton label="" />
          <SoundDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  } else return <DummyList />;
};

export const SoundCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" />
      <FileInput label="音檔" source="sound" validate={required()}>
        <FileField source="src" title="name" />
      </FileInput>
    </SimpleForm>
  </Create>
);

export const SoundEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <TextInput label="名稱" source="name" />
      <FileInput label="音檔" source="sound" validate={required()}>
        <FileField source="src" title="name" />
      </FileInput>
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
    </SimpleForm>
  </Edit>
);
