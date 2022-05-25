// in src/posts.js
import * as React from "react";
import axios from "axios";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  Filter,
  SimpleShowLayout,
  SimpleForm,
  ReferenceField,
  ReferenceInput,
  TextField,
  TextInput,
  ShowButton,
  EditButton,
  DeleteButton,
  RichTextField,
  SelectInput,
  FileField,
  FileInput,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

const sendPushNotification = (data) => {
  var data = JSON.stringify({
    app_id: "6d20395f-3945-4a16-a8ed-39e409d65f85",
    included_segments: ["Subscribed Users"],
    data: {
      foo: "bar",
    },
    contents: {
      en: "English Message",
    },
  });
  var config = {
    method: "post",
    url: "https://onesignal.com/api/v1/notifications",
    headers: {
      Authorization: "Basic OWM0MTcyNmUtYTgxNS00ZmFmLTgyMmItMjI5NDIyZjI5Yjcz",
      "Content-Type": "application/json",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const PostList = (props) => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <TextField source="title" />
      <RichTextField source="body" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" redirect={false} />
    </Datagrid>
  </List>
);

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />

      {/* <ReferenceField label="Comment" source="title" reference="comments">
        <TextField source="title" />
      </ReferenceField> */}
      <TextField source="createdate" />
      <TextField source="lastupdate" />
      <RichTextField source="body" />
      <FileField source="file.src" title="file.title" />
    </SimpleShowLayout>
  </Show>
);

export const PostCreate = (props) => (
  <Create onSuccess={() => sendPushNotification()} {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <RichTextInput source="body" />
      <SelectInput
        source="language"
        choices={[
          { id: "english", name: "English" },
          { id: "arabic", name: "العربية" },
          { id: "francais", name: "Français" },
          { id: "deutsch", name: "Deutsch" },
        ]}
      />
      {/* <ReferenceInput label="Comment" source="title" reference="comments">
        <SelectInput optionText="title" />
      </ReferenceInput> */}
      <FileInput source="file" label="File" accept="application/pdf">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Create>
);

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      {/* <ReferenceInput source="id" options={{ disabled: true }} />
      <ReferenceInput source="createdate" options={{ disabled: true }} />
      <ReferenceInput source="lastupdate" options={{ disabled: true }} /> */}
      {/* <ReferenceInput label="Comment" source="title" reference="comments">
        <SelectInput optionText="title" />
      </ReferenceInput> */}
      <TextInput source="title" />
      <RichTextInput source="body" />
      {/* <SelectInput
        source="rating"
        choices={[
          { id: 1, name: "Good" },
          { id: 2, name: "Okay" },
          { id: 3, name: "Bad" },
        ]}
      /> */}
      <FileInput source="file" label="File" accept="application/pdf">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);
