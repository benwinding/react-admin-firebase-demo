import * as React from "react";
import { firebaseConfig as config } from "./FIREBASE_CONFIG";

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
  DateTimeInput,
  Button,
  useRefresh,
  useNotify,
  Confirm,
  BooleanField,
  BooleanInput,
  NumberInput,
  ArrayInput,
  ReferenceInput,
  SimpleFormIterator,
  AutocompleteInput,
  required,
  FormDataConsumer,
  useDataProvider,
  useRecordContext,
} from "react-admin";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useQueryClient } from "@tanstack/react-query";
import { FirebaseDataProvider } from "react-admin-firebase";
import * as xid from "./xid";
import { RichTextInput } from "ra-input-rich-text";

import { getRecordField, withoutDisplayFields } from "./utils";

import { useAllData, getActions, apiUrl } from "./serverCommon";
import { getPrevId } from "./actionCommon";
import { isSuperUser, getAuthUid } from "./App";
import ImageReferenceInput from "./ImageReferenceInput";
import {
  scenarioResources,
  setCurrentScenario,
  useCurrentScenario,
  getCurrentScenario,
  clearCurrentScenario,
} from "./currentScenario";

import { buildGPX, BaseBuilder } from "gpx-builder";
const { Point, Track, Segment } = BaseBuilder.MODELS;

const scenarioFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];
// const cdnRoot = 'http://daqiaotou-storage.floraland.tw/ghostspeak_editor';

function useIsCurrentScenario(record) {
  const currentScenario = useCurrentScenario();
  return !!record && currentScenario === record.id;
}

function UseButton(props) {
  const record = useRecordContext(props);
  const active = useIsCurrentScenario(record);
  const queryClient = useQueryClient();
  const refresh = useRefresh();
  function handleClick() {
    setCurrentScenario(
      getRecordField(record, "id"),
      getRecordField(record, "name")
    );
    // drop cached records of the previous scenario
    queryClient.removeQueries({
      predicate: (query) => scenarioResources.includes(query.queryKey[0]),
    });
    refresh();
  }
  return (
    <Button label="設定為目前劇本" onClick={handleClick} disabled={active} />
  );
}

function getTriggers(currentNode, parents) {
  if (currentNode.firstAction) {
    return [
      {
        id: "",
        actionId: null,
        receiver: "ghost",
        sender: "?u",
        payload: {
          type: "JOIN",
        },
        scenarioId: "",
      },
    ];
  } else {
    const ret = parents.flatMap((p) => getTriggerList(currentNode, p));
    return ret.filter((value, index) => {
      const _value = JSON.stringify(value);
      return (
        index ===
        ret.findIndex((obj) => {
          return JSON.stringify(obj) === _value;
        })
      );
    });
  }
}

function getTriggerList(currentNode, parentNode) {
  return currentNode.prevs
    .filter((p) => p.prev == parentNode.id)
    .map((condition) => {
      if (!condition) {
        console.error(
          "bad parent",
          currentNode.name,
          parentNode.name,
          parentNode.id,
          currentNode.prevs.map((p) => p.prev)
        );
      }
      const actionId =
        condition.conditionType === "TEXT"
          ? parentNode.id + "-popup"
          : getPrevId(parentNode);

      return {
        id: "",
        actionId: actionId,
        receiver: parentNode.sender || "ghost",
        sender: "?u",
        payload: {
          type: condition.conditionType === "TEXT" ? "TEXT" : "END",
          text: condition.fallback ? "fallback:" : condition.userReply,
          asVariable: condition.asVariable,
        },
        scenarioId: "",
      };
    });
}

// TODO: system hole
// only one condition holds
function getCondition(currentNode, data) {
  const { locations, beacons } = data;
  const active =
    currentNode.prevs &&
    currentNode.prevs.find((p) => p.conditionType != "TEXT" && p.conditionType);
  if (active) {
    return {
      type: active.conditionType,
      beaconId: active.beacon ? beacons[active.beacon].beaconId : null,
      threshold: active.beaconThreshold,
      mode: active.beaconType,
      location: active.geofenceCenter ? locations[active.geofenceCenter] : null,
      radius: active.geofenceRadius || 14,
    };
  } else {
    return { type: "ALWAYS" };
  }
}

function PublishButton(props) {
  const record = useRecordContext(props);
  const disabled = !useIsCurrentScenario(record);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const data = useAllData();
  const { actions, variables, images } = data;
  const [open, setOpen] = useState(false);
  const people = Object.values(data.people);
  function getFriends(node, condition) {
    return people.map((f) => {
      let portrait = null;
      if (f.userPortrait) {
        portrait = images[f.userPortrait]?.image?.src;
      }
      return {
        id: xid.next() + "-friend",
        receiver: "?u",
        sender: "ghost",
        content: {
          task: {
            type: "FRIEND",
            id: f.id,
            icon: portrait,
            name: f.name,
          },
          condition: condition,
        },
        description: node.name,
        session: {
          scenario: "",
          chapter: "",
        },
      };
    });
  }

  async function handleConfirm() {
    setOpen(false);
    setLoading(true);
    const actionTree = getActionTree(Object.values(actions));
    if (!actionTree) {
      setLoading(false);
      setOpen(false);
      notify("沒有初始動作，無法發佈！", { type: "error" });
      return;
    }

    function getNode(tree) {
      const parents = tree.node.prevs
        ? tree.node.prevs.map((p) => actions[p.prev])
        : [];
      const condition = getCondition(tree.node, data);
      const serverActions = getActions(tree.node, data, condition);
      const isFirst = tree.node.firstAction;
      if (isFirst) {
        getFriends(tree.node, condition).forEach((f) => serverActions.push(f));
      }
      return {
        name: isFirst ? "initial" : tree.node.id,
        children: tree.node.children || [],
        exclusiveWith: (tree.node.exclusiveWith || []).filter((e) => e),
        triggers: getTriggers(tree.node, parents),
        performances: serverActions.map((a) => ({
          action: a,
          delay: a.delay === 0 || a.delay ? a.delay : 0,
          time: a.time,
        })),
        preconditions: tree.node.preconditions?.map((p) => ({
          name: variables[p.variable]?.name,
          comparison: p.comparison,
          value: p.value,
        })),
      };
    }

    function getNodes(tree) {
      return tree.children.reduce(
        (agg, c) => [...agg, ...getNodes(c)],
        [getNode(tree)]
      );
    }
    try {
      const scenarioId = getRecordField(record, "id");
      const template = getNodes(actionTree);
      const initialNode = template[0];
      if (initialNode) {
        const tasks = initialNode.performances.map(
          (p) => p.action.content.task
        );
        const validInitial = tasks.find(
          (t) =>
            t.type === "MARKER" ||
            (t.type === "POPUP" && t.destinations.indexOf("INTRO") >= 0) ||
            t.type === "INTRO_IMAGE"
        );
        if (!validInitial) {
          initialNode.performances.push({
            action: {
              id: "shadow-intro",
              receiver: "?u",
              sender: "ghost",
              content: {
                task: {
                  type: "POPUP",
                  destinations: ["INTRO"],
                  text: "",
                  allowTextReply: false,
                },
                condition: {
                  type: "ALWAYS",
                },
              },
              delay: 0,
              time: null,
              description: "首頁",
              session: {
                scenario: "",
                chapter: "",
              },
            },
          });
        }
      }
      // const urlString = `http://localhost:8080/v1/scenario/graphscript/${getRecordField(
      const urlString = `${apiUrl}/v1/scenario/graphscript/${scenarioId}`;
      const url = new URL(urlString);
      const displayName = getRecordField(record, "displayName") || null;
      const categories =
        getRecordField(record, "categories")?.map((c) => c.category) || [];
      const params = {
        overwrite: true,
      };

      const provider = getProvider(scenarioId);
      const pictureId = getRecordField(record, "pictureId");
      let imageUrl = null;
      if (pictureId) {
        const result = await provider.getOne("images", {
          id: pictureId,
        });
        imageUrl = result.data?.image?.src;
      }
      const metadata = {
        name: getRecordField(record, "name"),
        displayName: displayName,
        description: getRecordField(record, "description"),
        featured: getRecordField(record, "featured"),
        public: getRecordField(record, "public"),
        ordinal: getRecordField(record, "ordinal") || Date.now(),
        categories: categories,
        passcode: getRecordField(record, "passcode") || null,
        details: getRecordField(record, "details") || null,
        image: imageUrl,
      };
      url.search = new URLSearchParams(params).toString();
      console.log("payload", template);
      console.log("params", params);
      console.log("metadata", metadata);

      fetch(url, {
        method: "PUT",
        body: JSON.stringify({ template, metadata }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            notify("成功發佈" + getRecordField(record, "name"), {
              type: "success",
            });
          } else {
            notify("發佈失敗；原因 =" + response.body + " " + response.status, {
              type: "error",
            });
          }
        })
        .catch((e) => {
          console.error("failed to publish", e);
          notify("發佈失敗；原因 = " + e, { type: "error" });
        })
        .finally(() => {
          setLoading(false);
          setOpen(false);
        });
    } catch (e) {
      console.error("failed to publish", e);
      notify("發佈失敗；原因 = " + e, { type: "error" });
      setLoading(false);
      setOpen(false);
    }
  }

  const name = getRecordField(record, "name");
  const confirm = (
    <span>
      <p>你即將發佈《{name}》。使用者的進度將被中斷。確定嗎？</p>
      <p>
        (正式上架需求請與
        <a
          href="https://facebook.com/urbanbakers"
          target="_blank"
          rel="noreferrer"
        >
          Urban Baker
        </a>
        聯絡)
      </p>
    </span>
  );

  return (
    <>
      <Button
        label="發佈"
        onClick={handleClick}
        disabled={disabled || loading || !data.loaded}
      />
      <Confirm
        isOpen={open}
        title="確認發佈"
        content={confirm}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認發佈"
        cancel="取消"
      />
    </>
  );
}

function unpublish(id) {
  const urlString = `${apiUrl}/v1/scenario/graphscript/${id}`;
  const url = new URL(urlString);
  return fetch(url, { method: "DELETE" });
}

function UnpublishButton(props) {
  const record = useRecordContext(props);
  const disabled = !useIsCurrentScenario(record);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  function handleConfirm() {
    setOpen(false);
    setLoading(true);
    unpublish(getRecordField(record, "id"))
      .then((response) => {
        if (response.ok) {
          notify("成功解除發佈" + getRecordField(record, "name"), {
            type: "success",
          });
        } else {
          notify(
            "解除發佈失敗；原因 =" + response.body + " " + response.status,
            { type: "error" }
          );
        }
      })
      .catch((e) => {
        notify("解除發佈失敗；原因 =" + e, { type: "error" });
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  }

  return (
    <>
      <Button
        label="解除發佈"
        onClick={handleClick}
        disabled={disabled || loading}
      />
      <Confirm
        isOpen={open}
        title="確認解除發佈"
        content={`你即將解除發佈${getRecordField(
          record,
          "name"
        )}；用戶將無法使用。確定嗎？`}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認解除發佈"
        cancel="取消"
      />
    </>
  );
}

function GpxButton(props) {
  const record = useRecordContext(props);
  const disabled = !useIsCurrentScenario(record);
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const data = useAllData();
  const { actions } = data;
  const [open, setOpen] = useState(false);
  open;
  function handleConfirm() {
    setOpen(false);
    setLoading(true);
    const actionTree = getActionTree(Object.values(actions));
    if (!actionTree) {
      setLoading(false);
      setOpen(false);
      notify("沒有初始動作，無法發佈！");
      return;
    }

    function getNode(tree) {
      const parents = tree.node.parents
        ? tree.node.parents.map((p) => actions[p])
        : [];
      const condition = getCondition(tree.node, data);
      return {
        name: tree.node.firstAction ? "initial" : tree.node.id,
        children: tree.node.children || [],
        exclusiveWith: tree.node.exclusiveWith || [],
        triggers: getTriggers(tree.node, parents),
        performances: getActions(tree.node, data, condition).map((a) => ({
          action: a,
          delay: a.delay === 0 || a.delay ? a.delay : tree.node.delay || 0,
        })),
      };
    }

    function getNodes(tree) {
      return tree.children.reduce(
        (agg, c) => [...agg, ...getNodes(c)],
        [getNode(tree)]
      );
    }
    try {
      const payload = getNodes(actionTree);
      const urlString = `${apiUrl}/v1/scenario/graphscript/${getRecordField(
        record,
        "id"
      )}`;
      const url = new URL(urlString);
      const params = {
        name: getRecordField(record, "name"),
        overwrite: true,
      };
      url.search = new URLSearchParams(params).toString();

      const points = payload
        .map((n) =>
          n.performances
            .map((p) => p.action.content.condition)
            .find((c) => c.type === "GEOFENCE")
        )
        .filter((c) => c)
        .map((c) => c.location)
        .map(
          (l) =>
            new Point(l.lat, l.lon, {
              ele: 10,
              time: new Date(),
              hr: 121,
            })
        );

      const gpxData = new BaseBuilder();
      const segs = [];
      for (var i = 1; i < points.length; i++) {
        segs.push(new Segment([points[i - 1], points[i]]));
      }
      const track = new Track(segs, {
        name: "main",
        cmt: "comment",
        desc: "desc",
      });
      gpxData.setWayPoints(points);
      gpxData.setTracks([track]);
      const gpx = buildGPX(gpxData.toObject());
      const cleanGpx = gpx
        .split("\n")
        .filter((l) => !l.includes("<time"))
        .join("\n");
      const link = document.createElement("a");
      const blob = new Blob([cleanGpx], { type: "application/gpx+xml" });
      const gpxUrl = window.URL.createObjectURL(blob);
      link.href = gpxUrl;
      link.download = getRecordField(record, "name") + ".gpx";
      setLoading(false);
      setOpen(false);
      link.click();
    } catch (e) {
      console.error("error exporting gpx", e);
      notify("路線檔產生失敗；原因 = " + e, { type: "error" });
      setLoading(false);
      setOpen(false);
    }
  }
  return (
    <>
      <Button
        label="路線檔"
        onClick={handleConfirm}
        disabled={disabled || loading || !data.loaded}
      />
    </>
  );
}

function Blocker({ isOpen }) {
  return (
    <Dialog open={isOpen} aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">複製中</DialogTitle>
      <DialogContent>
        <DialogContentText>請等待複製完成後再繼續操作。</DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

function getProvider(scenarioId) {
  const scenarioOtions = {
    logging: false,
    rootRef: "ghostspeak_editor/" + scenarioId,
  };
  return FirebaseDataProvider(config, scenarioOtions);
}

// Firestore batches hold at most 500 writes
const deleteBatchSize = 400;

// deletes the scenario's own records (actions, images, ...); uploaded files
// stay in Storage
async function deleteScenarioRecords(scenarioId) {
  const provider = getProvider(scenarioId);
  for (const resource of scenarioResources) {
    const { data } = await provider.getList(resource, {
      pagination: { page: 1, perPage: 100000 },
      sort: { field: "id", order: "ASC" },
      filter: {},
    });
    const ids = data.map((r) => r.id);
    for (let i = 0; i < ids.length; i += deleteBatchSize) {
      await provider.deleteMany(resource, {
        ids: ids.slice(i, i + deleteBatchSize),
      });
    }
  }
}

function DeleteButton(props) {
  const record = useRecordContext(props);
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);
  const scnId = getRecordField(record, "id");
  const deleteScenario = () =>
    dataProvider.delete("scenarios", { id: scnId, previousData: record });
  const refresh = useRefresh();
  async function handleConfirm() {
    setOpen(false);
    setLoading(true);
    try {
      const response = await unpublish(scnId);
      if (response.ok) {
        await deleteScenarioRecords(scnId);
        const result = await deleteScenario();
        console.log("delete result:", scnId, result);
        if (getCurrentScenario() === scnId) {
          clearCurrentScenario();
        }
        notify("成功刪除" + getRecordField(record, "name"), {
          type: "success",
        });
      } else {
        notify(
          `刪除失敗；原因 = 無法解除發佈${response.body} ${response.status}`,
          { type: "error" }
        );
      }
    } catch (e) {
      console.error("failed to delete scenario", e);
      notify("刪除失敗；原因 =" + e, { type: "error" });
    } finally {
      setLoading(false);
      refresh();
    }
  }
  return (
    <>
      <Button label="刪除" onClick={handleClick} disabled={loading} />
      <Confirm
        isOpen={open}
        title="確認刪除劇本"
        content={`你即將刪除${getRecordField(
          record,
          "name"
        )}；此動作無法回復。確定嗎？`}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認刪除"
        cancel="取消"
      />
    </>
  );
}

function CloneButton(props) {
  const record = useRecordContext(props);
  const disabled = !useIsCurrentScenario(record);
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const handleDialogClose = () => setOpen(false);

  const {
    actions,
    sounds,
    locations,
    beacons,
    images,
    mapStyles,
    broadcasts,
    variables,
    people,
    loaded,
  } = useAllData();
  const refresh = useRefresh();
  const idMap = new Map();
  Object.keys(actions).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(locations).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(beacons).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(images).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(sounds).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(mapStyles).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(broadcasts).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(variables).forEach((a) => idMap.set(a, xid.next()));
  Object.keys(people).forEach((a) => idMap.set(a, xid.next()));
  function updateValueFor(obj, field) {
    const value = obj[field];
    if (value) {
      const newValue = idMap.get(value);
      obj[field] = newValue ? newValue : null;
    }
  }
  const createData = JSON.parse(JSON.stringify(record));
  const cloneId = xid.next();
  createData.id = cloneId;
  createData.name = getRecordField(record, "name") + "-" + cloneId;
  createData.cloned = true;
  updateValueFor(createData, "pictureId");
  createData.passcode = null;
  createData.categories = null;
  createData.featured = false;
  createData.public = false;
  // the copy belongs to whoever made it
  createData.uid =
    getAuthUid() || localStorage.getItem("uid") || createData.uid;
  const create = () => dataProvider.create("scenarios", { data: createData });
  const baseProvider = getProvider(createData.id);
  async function cloneScenario() {
    await create();

    function createFields(field, fieldName) {
      const values = Object.values(field);
      return values.map((a) => {
        const newA = JSON.parse(JSON.stringify(a));
        newA.id = idMap.get(a.id);
        return baseProvider.create(fieldName, {
          data: withoutDisplayFields(newA),
        });
      });
    }

    await Promise.all([
      ...createFields(locations, "locations"),
      ...createFields(beacons, "beacons"),
      ...createFields(images, "images"),
      ...createFields(sounds, "sounds"),
      ...createFields(mapStyles, "mapStyles"),
      ...createFields(variables, "variables"),
      ...createFields(people, "people"),
    ]);
    function updateValuesFor(a) {
      updateValueFor(a, "geofenceCenter");
      updateValueFor(a, "beacon");
      updateValueFor(a, "soundId");
      updateValueFor(a, "mapStyle");
      updateValueFor(a, "soundCenterId");
      updateValueFor(a, "markerIcon");
      updateValueFor(a, "portrait");
      updateValueFor(a, "locationId");
      updateValueFor(a, "markerId");
      updateValueFor(a, "introBackground");
      updateValueFor(a, "introLogo");
      updateValueFor(a, "mapLogo");
      updateValueFor(a, "variable");
      updateValueFor(a, "guideImage");
      updateValueFor(a, "silencedSound");
      updateValueFor(a, "beaconForSound");
      updateValueFor(a, "sender");
      if (a.variableUpdates) {
        a.variableUpdates.forEach((u) => {
          updateValueFor(u, "variable");
        });
      }
      if (a.preconditions) {
        a.preconditions.forEach((p) => {
          updateValueFor(p, "variable");
        });
      }
      if (a.pictures) {
        a.pictures.forEach((p) => {
          const newId = idMap.get(p.pictureId);
          p.pictureId = newId;
        });
      }
    }
    await Promise.all(
      Object.values(broadcasts).map((a) => {
        const newA = JSON.parse(JSON.stringify(a));
        newA.id = idMap.get(a.id);
        updateValuesFor(newA);
        return baseProvider.create("broadcasts", {
          data: withoutDisplayFields(newA),
        });
      })
    );
    await Promise.all(
      Object.values(actions).map((a) => {
        const newA = JSON.parse(JSON.stringify(a));
        newA.id = idMap.get(a.id);
        if (newA.exclusiveWith) {
          newA.exclusiveWith = newA.exclusiveWith
            .map((id) => idMap.get(id))
            .filter((e) => e);
        }
        updateValuesFor(newA);
        // for new formats
        if (newA.prevs) {
          newA.prevs.forEach((p) => {
            updateValueFor(p, "prev");
            updateValueFor(p, "beacon");
            updateValueFor(p, "geofenceCenter");
          });
        }
        // for old formats
        else if (newA.parents) {
          const oldParents = newA.parents;
          newA.parents = newA.parents.map((id) => idMap.get(id));
          const prevs = oldParents.map((oldId) => {
            const newId = idMap.get(oldId);
            const cond = newA[`triggers_${oldId}_conditionType`];
            const rec = {};
            rec.prev = newId;
            newA[`triggers_${newId}_id`] = newId;
            if (cond) {
              delete newA[`triggers_${oldId}_conditionType`];
              rec.conditionType = cond;
            }
            if (cond === "BEACON") {
              rec.beacon = newA.beacon;
              rec.beaconThreshold = newA.beaconThreshold;
              rec.beaconType = newA.beaconType;
            }
            if (cond === "GEOFENCE") {
              rec.geofenceCenter = newA.geofenceCenter;
              rec.geofenceRadius = newA.geofenceRadius || 14;
            }
            const reply = newA[`triggers_${oldId}_userReply`];
            if (reply) {
              delete newA[`triggers_${oldId}_userReply`];
              rec.userReply = reply;
            }
            const fallback = newA[`triggers_${oldId}_fallback`];
            if (fallback) {
              delete newA[`triggers_${oldId}_fallback`];
              rec.fallback = fallback;
            }
            const asVariable = newA[`triggers_${oldId}_asVariable`];
            if (asVariable) {
              delete newA[`triggers_${oldId}_asVariable`];
              rec.asVariable = asVariable;
            }
            return rec;
          });
          newA.prevs = prevs;
        }
        return baseProvider.create("actions", {
          data: withoutDisplayFields(newA),
        });
      })
    );
  }

  async function handleConfirm() {
    setOpen(false);
    setLoading(true);
    try {
      await cloneScenario();
      notify("複製成功", { type: "success" });
    } catch (e) {
      console.error("failed to clone", e);
      notify("複製失敗；原因 = " + e, { type: "error" });
    } finally {
      setLoading(false);
      refresh();
    }
  }

  return (
    <>
      <Button
        label="複製"
        onClick={handleClick}
        disabled={disabled || loading || !loaded}
      />
      <Confirm
        isOpen={open}
        title="確認複製"
        content={`你即將複製一份《${getRecordField(
          record,
          "name"
        )}》；確定嗎？`}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認複製"
        cancel="取消"
      />
      <Blocker isOpen={loading} />
    </>
  );
}

const Title = () => {
  const record = useRecordContext();
  return <span>劇本{record && record.name ? `：${record.name}` : ""}</span>;
};

export const ScenarioList = () => {
  return (
    <List
      title={<Title />}
      sort={{ field: "ordinal", order: "DESC" }}
      perPage={25}
      filters={scenarioFilters}
    >
      <Datagrid rowClick={false}>
        <TextField label="名稱" source="name" />
        <TextField label="說明" source="description" />
        <BooleanField label="正式上架" source="public" />
        <UseButton />
        <PublishButton />
        <UnpublishButton />
        <CloneButton />
        <GpxButton />
        <EditButton label="" />
        <DeleteButton label="" redirect={false} />
      </Datagrid>
    </List>
  );
};

const InputForm = (props) => {
  const uid = getAuthUid() || "dead";
  const [isSuper, setIsSuper] = useState(false);
  useEffect(() => {
    isSuperUser(localStorage.getItem("uid")).then((s) => {
      setIsSuper(s);
    });
  }, []);
  return (
    <SimpleForm>
      <TextInput readOnly source="id" />
      <TextInput label="名稱" source="name" />
      <TextInput label="顯示名稱" source="displayName" />
      <TextInput label="說明" source="description" multiline />
      {!props.create && (
        <NumberInput label="順序" source="ordinal" defaultValue={Date.now()} />
      )}
      {!props.create && (
        <DateTimeInput label="建立時間" readOnly source="createdate" />
      )}
      {!props.create && (
        <DateTimeInput label="修改時間" readOnly source="lastupdate" />
      )}
      <h3>進階內容</h3>
      <BooleanInput label="開啟進階內容" source="advancedScenarioType" />
      <FormDataConsumer>
        {({ formData }) => (
          <>
            {formData.advancedScenarioType && (
              <>
                <ImageReferenceInput
                  label="圖片"
                  source="pictureId"
                  reference="images"
                  sort={{
                    field: "lastupdate",
                    order: "DESC",
                  }}
                  perPage={1000}
                />
                <RichTextInput label="詳細說明" source="details" />
                <BooleanInput
                  label="精選"
                  source="featured"
                  readOnly={!isSuper}
                />
                <TextInput
                  label="通行碼"
                  source="passcode"
                  readOnly={!isSuper}
                />
                <ArrayInput label="分類" source="categories">
                  <SimpleFormIterator disabled={!isSuper}>
                    <ReferenceInput source="category" reference="categories">
                      <AutocompleteInput
                        label="類別"
                        validate={[required()]}
                        optionText="name"
                        readOnly={!isSuper}
                      />
                    </ReferenceInput>
                  </SimpleFormIterator>
                </ArrayInput>
                {!props.create && (
                  <BooleanInput
                    label="正式上架"
                    source="public"
                    readOnly={!isSuper}
                  />
                )}
              </>
            )}
          </>
        )}
      </FormDataConsumer>
      <TextInput label="user id" source="uid" readOnly defaultValue={uid} />
    </SimpleForm>
  );
};

export const ScenarioCreate = () => (
  <Create title={<Title />}>
    <InputForm create={true} />
  </Create>
);

export const ScenarioEdit = () => (
  <Edit title={<Title />}>
    <InputForm create={false} />
  </Edit>
);

export function getActionTree(actions) {
  const initial = actions.find((a) => a.firstAction);
  const nodesSet = new Set();
  const parentMap = actions.reduce(function (m, a) {
    if (a.prevs) {
      a.prevs.forEach((p) => {
        const orig = m.get(p.prev) || [];
        m.set(p.prev, [...orig, a]);
      });
      return m;
    } else {
      return m;
    }
  }, new Map());

  function createTree(root) {
    const children = parentMap.get(root.id) || [];
    const childNodes = children.map((c) => {
      if (nodesSet.has(c.id)) {
        return null;
      } else {
        nodesSet.add(c.id);
        return c;
      }
    });
    root.children = children.map((c) => c.id);
    const treeChildren = childNodes.filter((c) => c).map((c) => createTree(c));
    treeChildren.sort((a, b) => a.children.length > b.children.length);
    return {
      node: root,
      children: treeChildren,
    };
  }
  if (initial) return createTree(initial);
  else return null;
}
