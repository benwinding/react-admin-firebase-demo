// in src/posts.js
import * as React from "react";
import axios from "axios";
import qs from "qs";
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
  useRecordContext,
} from "react-admin";
import RichTextInput from "ra-input-rich-text";

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="title" alwaysOn />
  </Filter>
);

export const VideoList = (props) => {
  const CustomDeleteButton = ({ type = "Item", field, ...props }) => {
    const { record } = props;
    // const record = useRecordContext();
    // handleDeleteFile(record[field]);
    console.log(record);
    return (
      <DeleteButton
        onSuccess={() => handleDeleteFile(record[field])}
        confirmTitle={`Delete ${type}: ${
          field ? record[field] : "this item"
        } ?`}
        confirmContent={"Are you sure you want to delete this video?"}
        {...props}
      />
    );
  };
  const handleDeleteFile = (fileName) => {
    var data = qs.stringify({
      fileName: fileName,
    });
    var config = {
      method: "post",
      url: "http://localhost:5005/deleteVideo",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <List {...props} filters={<PostFilter />}>
      <Datagrid rowClick={(id) => alert(id)}>
        <RichTextField source="filename" />
        <TextField source="language" />

        <CustomDeleteButton undoable={false} type="Video" field="filename" />
      </Datagrid>
    </List>
  );
};

export const VideoShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="lang" />
    </SimpleShowLayout>
  </Show>
);

export const UploadVideo = (props) => {
  const [lang, setLang] = React.useState("English");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const onFileChange = (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file", selectedFile, selectedFile.name);
    formData.append("lang", lang);
    // Details of the uploaded file
    console.log(formData);

    // Request made to the backend api
    // Send formData object
    axios.post("http://localhost:5005/uploadVideo", formData);
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>

          <p>File Name: {selectedFile.name}</p>

          <p>File Type: {selectedFile.type}</p>

          <p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };
  return (
    <div>
      <h1>Visma Dashboard Videos</h1>
      <h3>File Upload using React!</h3>
      <select id="cars" name="cars" onChange={(e) => setLang(e.target.value)}>
        <option value="english">English</option>
        <option value="arabic">العربية</option>
        <option value="francais">Français</option>
        <option value="deutsch">Deutsch</option>
      </select>

      <div style={{ marginTop: 20 }}>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {fileData()}
    </div>
  );
};

// <Create {...props}>
//   <SimpleForm>
//     <TextInput source="title" />

//     <FileInput source="file" label="File">
//       <FileField source="src" title="title" />
//     </FileInput>
//   </SimpleForm>
// </Create>

export const VideoEdit = (props) => (
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
