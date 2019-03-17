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

export const PrintProps = props => (
  <div>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
);

export const PostList = props => {
  console.log("PostList: ", { props });
  return (
    <div>
      <PrintProps {...props}> </PrintProps>
      <List {...props} filters={<PostFilter />}>
        <Datagrid>
          <TextField source="title" label="Title" />
          <RichTextField source="body" label="Body" />
          <SelectField source="rating" choices={ratingChoices} />

          <ShowButton label="" />
          <EditButton label="" />
          <DeleteButton label="" />
        </Datagrid>
      </List>
    </div>
  );
};

const MySubCollectionArray = props => {
  const subUrl = "/posts" + props.record.id + props.subcollection;
  let fakeProps = {
    basePath: subUrl,
    permissions: {},
    match: {
      path: subUrl,
      url: subUrl,
      isExact: true,
      params: {}
    },
    location: {
      pathname: subUrl,
      search: "",
      hash: ""
    },
    hasCreate: false,
    hasEdit: false,
    hasList: true,
    hasShow: false,
    history: {},
    options: {},
    resource: "posts*comments"
  };
  console.log("MySubCollectionArray: ", { props, fakeProps });
  return (
    <div>
      <PrintProps {...props}> </PrintProps>
      <List {...fakeProps}>
        <Datagrid>
          <TextField source="title" label="Title" />
          <RichTextField source="body" label="Body" />
          <SelectField source="rating" choices={ratingChoices} />
        </Datagrid>
      </List>
    </div>
  );
};

export const PostShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="id" />
      <TextField source="title" label="title" />
      <RichTextField source="body" label="body" />
      <SelectField source="rating" label="rating" choices={ratingChoices} />

      <MySubCollectionArray label="Comments by" subcollection="comments" />
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
