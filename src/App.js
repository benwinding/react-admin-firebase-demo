import * as React from "react";
import { PostList, PostShow, PostCreate, PostEdit } from "./posts";
import { VideoShow, VideoEdit, VideoList, UploadVideo } from "./videos";
import { QuestionShow, QuestionList, QuestionCreate } from "./questions";
import { UserList, UserShow, UserCreate, UserEdit } from './users';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {
  CommentList,
  CommentShow,
  CommentCreate,
  CommentEdit,
} from "./comments";
import { Admin, Resource } from "react-admin";
import {
  FirebaseDataProvider,
  FirebaseAuthProvider,
} from "react-admin-firebase";
import CommentIcon from "@material-ui/icons/Comment";
import CustomLoginPage from "./CustomLoginPage";
import UserIcon from '@material-ui/icons/People';

import { firebaseConfig as config } from "./FIREBASE_CONFIG";

const options = {
  logging: true,
  rootRef: "rssFeeds/feeds",
};
const dataProvider = FirebaseDataProvider(config, options);
const authProvider = FirebaseAuthProvider(config, options);

class App extends React.Component {
  render() {
    return (
      <Admin
        loginPage={CustomLoginPage}
        dataProvider={dataProvider}
        authProvider={authProvider}
      >
        <Resource
          name="feeds"
          list={PostList}
          show={PostShow}
          create={PostCreate}
          edit={PostEdit}
        />

        <Resource
          name="videos"
          icon={CommentIcon}
          list={VideoList}
          show={VideoShow}
          create={UploadVideo}
          edit={VideoEdit}
        />
        <Resource
          name="questions"
          icon={CommentIcon}
          list={QuestionList}
          show={QuestionShow}
          create={QuestionCreate}
          // edit={VideoEdit}
        />
         <Resource
            name="users"
            icon={UserIcon}
            list={UserList}
            show={UserShow}
            create={UserCreate}
            edit={UserEdit}
          />
      </Admin>
    );
  }
}

export default App;
