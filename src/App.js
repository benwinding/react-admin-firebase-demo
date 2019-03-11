import * as React from "react";
import { PostList, PostSubList, PostSubShow, PostShow, PostCreate, PostEdit } from "./posts";
import { TagList, TagShow, TagCreate, TagEdit } from "./tags";
import { Admin, Resource } from "react-admin";
import {
  FirebaseRealTimeSaga,
  FirebaseDataProvider
} from "react-admin-firebase";

import LocalOffer from '@material-ui/icons/LocalOffer';

const config = require("./FIREBASE_CONFIG.js").config;

const dataProvider = FirebaseDataProvider(config, true);
const options = {
  observe: ["posts"]
};
const firebaseRealtime = FirebaseRealTimeSaga(dataProvider, options);

class App extends React.Component {
  render() {
    return (
      <Admin
      customSagas={[firebaseRealtime]}
      dataProvider={dataProvider}>
        <Resource
          name="posts"
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        />
        <Resource
          name="posts*sub"
          list={PostSubList}
          show={PostSubShow}
        />
        <Resource
          name="tags"
          icon={LocalOffer}
          list={TagList}
          show={TagShow}
          create={TagCreate}
          edit={TagEdit}
        />
      </Admin>
    );
  }
}

export default App;
