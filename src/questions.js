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
  RadioButtonGroupInput,
  BooleanField,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

export const QuestionList = (props) => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <TextField source="Name" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
      <ShowButton label="" />
      {/* <EditButton label="" />
      <DeleteButton label="" redirect={false} /> */}
    </Datagrid>
  </List>
);

export const QuestionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="Name" />
      <TextField label={"Question 1"} source="question1.question" />
      <BooleanField label={"Answer"} source="question1.answer" />
      <TextField label={"Question 2"} source="question2.question" />
      <BooleanField label={"Answer"} source="question2.answer" />
      <TextField label={"Question 3"} source="question3.question" />
      <BooleanField label={"Answer"} source="question3.answer" />
      <TextField label={"Question 4"} source="question4.question" />
      <BooleanField label={"Answer"} source="question4.answer" />
      <TextField label={"Question 5"} source="question5.question" />
      <BooleanField label={"Answer"} source="question5.answer" />
      <TextField source="createdate" />
      <TextField source="lastupdate" />
    </SimpleShowLayout>
  </Show>
);

export const QuestionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="Name" />
      <TextInput disabled source="Are You a resident of sweden?" />
      <RadioButtonGroupInput
        source="Are You a resident of sweden?"
        choices={[
          { id: "Yes", name: "Yes" },
          { id: "No", name: "No" },
        ]}
      />
    </SimpleForm>
  </Create>
);

export const QuestionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="title" />
      <RichTextInput source="body" />

      <FileInput source="file" label="File" accept="application/pdf">
        <FileField source="src" title="title" />
      </FileInput>
    </SimpleForm>
  </Edit>
);
