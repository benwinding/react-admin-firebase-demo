import * as React from "react";
import { PostList, PostShow, PostCreate, PostEdit } from "./posts";
import { CommentList, CommentShow, CommentCreate, CommentEdit } from "./comments";
import { Admin, Resource } from "react-admin";
import {
  FirebaseRealTimeSaga,
  FirebaseDataProvider,
  FirebaseAuthProvider
} from "react-admin-firebase";

import { firebaseConfig as config } from './FIREBASE_CONFIG';
config.debug = true;

const authProvider = FirebaseAuthProvider(config);
const dataOptions = {
  logging: true,
  rootRef: 'root_collection/some_document'
}
const dataProvider = FirebaseDataProvider(config, dataOptions);
const options = {
  observe: ["posts"]
};
const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);

class App extends React.Component {
  render() {
    return (
      <Admin
        customSagas={[firebaseRealtime]}
        dataProvider={dataProvider}
        authProvider={authProvider}
      >
        <Resource
          name="posts"
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        />
        <Resource
          name="comments"
          list={CommentList}
          show={CommentShow}
          create={CommentCreate}
          edit={CommentEdit}
        />
      </Admin>
    );
  }
}

export default App;
