import { getRecordField } from "./utils";
import { getCurrentScenario } from "./currentScenario";
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

const resourceLabels = {
  actions: "動作",
  broadcasts: "廣播",
  people: "朋友",
  scenarios: "劇本",
};

// Deletes the record unless another record still refers to it.
// `references` maps each referencing resource to the paths that may hold
// this record's id, e.g. { actions: ["soundId"], broadcasts: ["soundId"] }.
export function getDeleteButton(props, resource, resourceName, references) {
  const record = useRecordContext(props);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const id = getRecordField(record, "id");
  const dataProvider = useDataProvider();
  // values at a dotted path; arrays along the way are flattened, so
  // "prevs.beacon" finds the beacon of every previous step
  function findValues(record, path) {
    return path
      .split(".")
      .reduce(
        (values, field) =>
          values.flatMap((v) => (v && v[field] ? v[field] : [])),
        [record]
      );
  }
  async function getRecords(referencingResource) {
    if (referencingResource === "scenarios") {
      // the current scenario is the only one that can use this scenario's records
      const result = await dataProvider.getOne("scenarios", {
        id: getCurrentScenario(),
      });
      return [result.data];
    }
    const result = await dataProvider.getList(referencingResource, {
      pagination: { page: 1, perPage: 100000 },
      sort: { field: "published_at", order: "DESC" },
      filter: {},
    });
    return result.data;
  }
  // names of the records that still use this one, e.g. 「動作：start」
  async function getUsers() {
    const users = await Promise.all(
      Object.entries(references).map(async ([referencingResource, paths]) => {
        const records = await getRecords(referencingResource);
        return records
          .filter((r) => paths.some((path) => findValues(r, path).includes(id)))
          .map((r) => `${resourceLabels[referencingResource]}：${r.name}`);
      })
    );
    return users.flat();
  }
  const name = getRecordField(record, "name");
  const refresh = useRefresh();
  async function handleConfirm() {
    setOpen(false);
    setLoading(true);
    try {
      const users = await getUsers();
      if (users.length === 0) {
        await dataProvider.delete(resource, { id, previousData: record });
        notify(`成功刪除${resourceName}: ${name}`, { type: "success" });
      } else {
        const msg = `無法刪除${resourceName}: ${name}，因仍被以下項目使用:`;
        notify(`${msg}${users.map((u) => `「${u}」`).join("")}`, {
          type: "error",
        });
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
