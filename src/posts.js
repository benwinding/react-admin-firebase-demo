// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  Filter,
  DisabledInput,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  SelectField,
  TextInput,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  SelectInput
} from "react-admin";
import RichTextInput from "ra-input-rich-text";

const PostFilter = props => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

const ratingChoices = [
  { id: 1, name: "Good" },
  { id: 2, name: "Okay" },
  { id: 3, name: "Bad" }
];

export const PostList = props => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <RichTextField source="body" />
      <SelectField source="rating" choices={ratingChoices} />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" />
    </Datagrid>
  </List>
);

export const PostShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <RichTextField source="body" />
      <SelectField source="rating" choices={ratingChoices} />
    </SimpleShowLayout>
  </Show>
);

export const PostCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <RichTextInput source="body" />
      <SelectInput source="rating" choices={ratingChoices} />
    </SimpleForm>
  </Create>
);

export const PostEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="title" />
      <RichTextInput source="body" />
      <SelectInput source="rating" choices={ratingChoices} />
    </SimpleForm>
  </Edit>
);

const epicChoices = [
  { id: 1, name: "Awesome" },
  { id: 2, name: "Okay" },
  { id: 3, name: "Terrible" }
];

export const PostSubList = props => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <TextField source="title" />
      <SelectField source="epicness" choices={epicChoices} />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" />
    </Datagrid>
  </List>
);

export const PostSubEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="title" />
      <SelectInput source="epicness" choices={epicChoices} />
    </SimpleForm>
  </Edit>
);

export const PostSubShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <SelectField source="epicness" choices={epicChoices} />
    </SimpleShowLayout>
  </Show>
);

export const PostSubCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <SelectInput source="epicness" choices={epicChoices} />
    </SimpleForm>
  </Create>
);
