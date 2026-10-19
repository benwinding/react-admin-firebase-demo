import { getRecordField } from "./utils";
import {
  Button,
  Confirm,
  useNotify,
  useRefresh,
  useDataProvider,
  useRecordContext,
} from "react-admin";
import * as React from "react";
import { useState } from "react";

export function getDeleteButton(props, resource, resourceName, references) {
  const record = useRecordContext(props);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const id = getRecordField(record, "id");
  const dataProvider = useDataProvider();
  async function getActionNames(actions, path) {
    const fields = path.split(".");
    function findValues(action) {
      return fields.reduce((a, f) => {
        const arr = a ? (Array.isArray(a) ? a : [a]) : [];
        if (a) {
          const level = arr.flatMap((e) => {
            if (e && e[f]) {
              return e[f];
            } else {
              return [];
            }
          });
          return level;
        }
      }, action);
    }
    const result = actions.filter((a) => findValues(a).includes(id));
    return result.map((r) => r.name);
  }
  async function getUsers() {
    const actionResult = await dataProvider.getList("actions", {
      pagination: { page: 1, perPage: 500 },
      sort: { field: "published_at", order: "DESC" },
    });
    const actions = Object.values(actionResult.data);
    return Promise.all(
      references.split(",").flatMap((path) => {
        const ret = getActionNames(actions, path);
        return ret;
      })
    );
  }
  const name = getRecordField(record, "name");
  const refresh = useRefresh();
  async function handleConfirm() {
    setOpen(false);
    setLoading(true);
    try {
      const actionNamePromise = await getUsers();
      const actionNames = Array.from(new Set(actionNamePromise.flat()));
      if (!actionNames || actionNames.length === 0) {
        await dataProvider.delete(resource, { id, previousData: record });
        notify(`成功刪除${resourceName}: ${name}`, { type: "success" });
      } else {
        const msg = `無法刪除${resourceName}: ${name}，因仍被以下動作使用:`;
        const actionString = actionNames
          .filter((a) => a)
          .map((a) => `「${a}」`);
        notify(`${msg}${actionString}`, { type: "error" });
      }
    } catch (e) {
      notify("刪除失敗；原因 =" + e, { type: "error" });
    }
    setLoading(false);
    setOpen(false);
    refresh();
  }
  return (
    <>
      <Button label="刪除" onClick={handleClick} disabled={loading} />
      <Confirm
        isOpen={open}
        title="確認刪除"
        content={`你即將刪除${resourceName}: ${name}；此動作無法回復。確定嗎？`}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認刪除"
        cancel="取消"
      />
    </>
  );
}
