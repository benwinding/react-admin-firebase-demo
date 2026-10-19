// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import { Datagrid, List, TextField } from "react-admin";

const Title = () => {
  return <span>請先設定目前劇本</span>;
};

const EmptyPage = () => (
  <div>
    <h1>請先設定目前劇本 ;-)</h1>
    <img
      width={540}
      height={960}
      src="http://daqiaotou-storage.floraland.tw/images/nothing.jpg"
    />
  </div>
);

export const DummyList = () => (
  <List title={<Title />} empty={<EmptyPage />} actions={false}>
    <Datagrid rowClick={false} bulkActionButtons={false}>
      <TextField label="請先設定目前劇本" source="name" />
    </Datagrid>
  </List>
);
