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
  number,
  NumberInput,
  NumberField,
  useRecordContext,
} from "react-admin";
import { DummyList } from "./dummy";
import { getDeleteButton } from "./deleteResource";

const variableFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{localStorage.getItem("scenarioName")}》變數
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const VariableDelete = (props) => {
  const paths = ["variableUpdates.variable"];
  return getDeleteButton(props, "variables", "變數", paths.join(","));
};

export const VariableList = () => {
  if (localStorage.getItem("scenario"))
    return (
      <List title={<Title />} filters={variableFilters}>
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <NumberField label="初始值" source="value" />
          <TextField label="說明" source="description" />
          <EditButton label="" />
          <VariableDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  else return <DummyList />;
};

export const VariableCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" validate={[required()]} />
      <NumberInput
        label="初始值"
        source="value"
        validate={[required(), number()]}
      />
      <TextInput label="說明" source="description" />
    </SimpleForm>
  </Create>
);

export const VariableEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
      <TextInput label="名稱" source="name" validate={[required()]} />
      <NumberInput
        label="初始值"
        source="value"
        validate={[required(), number()]}
      />
      <TextInput label="說明" source="description" />
    </SimpleForm>
  </Edit>
);
