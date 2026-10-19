import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Create,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  EditButton,
  DeleteButton,
  CreateButton,
  ExportButton,
  NumberField,
  NumberInput,
  DateTimeInput,
  BooleanField,
  BooleanInput,
  TopToolbar,
  Button,
  Confirm,
  useGetList,
  useNotify,
  SelectInput,
  useRecordContext,
} from "react-admin";

import { useState } from "react";
import { apiUrl } from "./serverCommon";

const displayTypes = [
  { id: "CAROUSEL", name: "左右滑動" },
  { id: "TWO_IN_A_ROW", name: "兩個一列" },
  { id: "ONE_IN_A_ROW", name: "一個一列" },
  { id: "LIST", name: "列表" },
];

const categoryFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      分類
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

function CatPublishButton() {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const categoryResult = useGetList("categories", {
    pagination: { page: 1, perPage: 500 },
    sort: { field: "order", order: "ASC" },
  });
  const categories = categoryResult.data || [];
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    setLoading(true);
    try {
      console.log("cats", categories);
      const urlString = `${apiUrl}/v1/category`;
      const url = new URL(urlString);
      const metadata = { categories: Object.values(categories) };
      fetch(url, {
        method: "PUT",
        body: JSON.stringify(metadata),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            notify("成功發佈分類", { type: "success" });
          } else {
            notify("發佈失敗；原因 =" + response.body + " " + response.status, {
              type: "error",
            });
          }
        })
        .catch((e) => {
          notify("發佈失敗；原因 =" + e, { type: "error" });
        })
        .finally(() => {
          setLoading(false);
          setOpen(false);
        });
    } catch (e) {
      notify(String(e), { type: "error" });
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button label="發佈" onClick={handleClick} disabled={loading} />
      <Confirm
        isOpen={open}
        title="確認發佈"
        content={`你即將發佈分類；使用者的進度將被中斷。確定嗎？`}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認發佈"
        cancel="取消"
      />
    </>
  );
}

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
    <CatPublishButton />
  </TopToolbar>
);

// TODO: sort by order
export const CategoryList = () => {
  return (
    <List
      title={<Title />}
      actions={<ListActions />}
      filters={categoryFilters}
      sort={{ field: "order", order: "ASC" }}
    >
      <Datagrid rowClick={false}>
        <NumberField label="順序" source="order" />
        <TextField label="名稱" source="name" />
        <TextField label="說明" source="description" />
        <BooleanField label="隱藏" source="hidden" />
        <EditButton label="" />
        <DeleteButton label="" redirect={false} />
      </Datagrid>
    </List>
  );
};

export const CategoryCreate = () => (
  <Create title={<Title />}>
    <SimpleForm>
      <TextInput label="名稱" source="name" />
      <TextInput label="簡介" source="description" />
      <SelectInput
        label="顯示方式"
        source="displayType"
        choices={displayTypes}
        defaultValue="ONE_IN_A_ROW"
      />
      <NumberInput label="顯示個數" source="displayCount" defaultValue={3} />
      <NumberInput label="順序" source="order" defaultValue={1} />
      <BooleanInput label="隱藏" source="hidden" defaultValue={false} />
    </SimpleForm>
  </Create>
);

export const CategoryEdit = () => (
  <Edit title={<Title />}>
    <SimpleForm>
      <TextInput readOnly source="id" />
      <TextInput label="名稱" source="name" />
      <TextInput label="簡介" source="description" />
      <SelectInput
        label="顯示方式"
        source="displayType"
        choices={displayTypes}
        defaultValue="ONE_IN_A_ROW"
      />
      <NumberInput label="顯示個數" source="displayCount" defaultValue={3} />
      <NumberInput label="順序" source="order" />
      <BooleanInput label="隱藏" source="hidden" />
      <DateTimeInput label="建立時間" readOnly source="createdate" />
      <DateTimeInput label="修改時間" readOnly source="lastupdate" />
    </SimpleForm>
  </Edit>
);
