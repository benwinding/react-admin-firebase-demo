import * as React from "react";
import {
  Datagrid,
  List,
  Create,
  Edit,
  SimpleForm,
  TextField,
  EditButton,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import { getDeleteButton } from "./deleteResource";
import ImageReferenceInput from "./ImageReferenceInput";

import { DummyList } from "./dummy";
const peopleFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{localStorage.getItem("scenarioName")}》朋友
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const PeopleDelete = (props) => {
  const paths = ["people"];
  return getDeleteButton(props, "people", "朋友", paths.join(","));
};

export const PeopleList = () => {
  if (localStorage.getItem("scenario")) {
    return (
      <List
        title={<Title />}
        perPage={100}
        sort={{ field: "name", order: "ASC" }}
        filters={peopleFilters}
      >
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="代號" source="id" />
          <TextField label="名字" source="name" />
          <EditButton label="" />
          <PeopleDelete label="" redirect={false} />
        </Datagrid>
      </List>
    );
  } else return <DummyList />;
};

const InputForm = () => {
  return (
    <SimpleForm>
      <>
        <TextInput label="姓名" source="name" validate={required()} />
        <br />
        <TextInput label="代號" source="id" validate={required()} />
        <br />
        <ImageReferenceInput
          label="圖示"
          source="userPortrait"
          reference="images"
          sort={{ field: "lastupdate", order: "DESC" }}
          perPage={1000}
          allowEmpty
        />
      </>
    </SimpleForm>
  );
};

export const PeopleCreate = () => (
  <Create title={<Title />}>
    <InputForm />
  </Create>
);

export const PeopleEdit = () => (
  <Edit title={<Title />}>
    <InputForm />
  </Edit>
);
