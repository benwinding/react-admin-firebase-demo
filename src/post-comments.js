// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  DisabledInput,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  SelectField,
  TextInput,
  ShowButton,
  EditButton,
  DeleteButton,
  SelectInput
} from "react-admin";

const statusChoices = [{ id: 1, name: "Approved" }, { id: 2, name: "Flagged" }];

export const PrintProps = props => (
  <div>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
);

export const PostCommentList = props => (
  <div>
    <PrintProps {...props}> </PrintProps>
    <List {...props}>
      <Datagrid>
        <TextField source="user" />
        <TextField source="text" />
        <SelectField source="status" choices={statusChoices} />
        <ShowButton label="" />
        <EditButton label="" />
        <DeleteButton label="" />
      </Datagrid>
    </List>
  </div>
);

export const PostCommentEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="user" />
      <TextInput source="text" />
      <SelectInput source="status" choices={statusChoices} />
    </SimpleForm>
  </Edit>
);

export const PostCommentShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="user" />
      <TextField source="text" />
      <SelectField source="status" choices={statusChoices} />
    </SimpleShowLayout>
  </Show>
);

export const PostCommentCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="user" />
      <TextInput source="text" />
      <SelectInput source="status" choices={statusChoices} />
    </SimpleForm>
  </Create>
);
