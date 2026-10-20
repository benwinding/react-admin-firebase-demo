import * as React from "react";
import {
  Button,
  BooleanInput,
  Confirm,
  Datagrid,
  List,
  Create,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  EditButton,
  DeleteButton,
  SelectInput,
  FormDataConsumer,
  required,
  FunctionField,
  useNotify,
  useRecordContext,
} from "react-admin";

import { getRecordField } from "./utils";
import { useState } from "react";

import BluetoothIcon from "@mui/icons-material/Bluetooth";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HourglassBottomIcon from "@mui/icons-material/HourglassEmpty";
import { DummyList } from "./dummy";
import { getCurrentScenario, getCurrentScenarioName } from "./currentScenario";
import { apiUrl } from "./serverCommon";

const conditionTypes = [
  { id: "ALWAYS", name: "立刻" },
  { id: "GEOFENCE", name: "GPS觸發" },
  { id: "BEACON", name: "Beacon觸發" },
];

import {
  getContentIcon,
  locationCondition,
  beaconCondition,
  soundInput,
  popupInput,
  popupDismissalInput,
  incomingCallInput,
  hangUpInput,
  markerInput,
  markerRemovalInput,
  mapStyleInput,
  validateBeforeSubmit,
  silenceInput,
} from "./actionCommon";

import { useAllData, getActions } from "./serverCommon";

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{getCurrentScenarioName()}》廣播
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};

const broadcastFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

export const BroadcastList = () => {
  if (getCurrentScenario()) {
    return (
      <List title={<Title />} perPage={100} filters={broadcastFilters}>
        <Datagrid rowClick={false}>
          <TextField label="編號" source="rowIndex" />
          <TextField label="名稱" source="name" />
          <FunctionField label="條件" render={getConditionIcon} />
          <FunctionField label="內容" render={getContentIcon} />
          <EditButton label="編輯" />
          <SendButton label="傳送" />
          <DeleteButton label="" redirect={false} />
        </Datagrid>
      </List>
    );
  } else return <DummyList />;
};

const InputForm = (props) => {
  return (
    <SimpleForm validate={validateBeforeSubmit}>
      <FormDataConsumer>
        {({ formData }) => {
          return (
            <>
              {props.showid === "true" ? (
                <TextInput source="id" readOnly />
              ) : (
                <></>
              )}
              <TextInput label="名稱" source="name" validate={[required()]} />{" "}
              <br />
              <h3>觸發順序</h3>
              <hr />
              <SelectInput
                label="觸發條件"
                source="conditionType"
                choices={conditionTypes}
              />
              <FormDataConsumer>
                {({
                  formData, // The whole form data
                }) => {
                  return (
                    <>
                      {formData &&
                        formData.conditionType === "GEOFENCE" &&
                        locationCondition()}
                      {formData &&
                        formData.conditionType === "BEACON" &&
                        beaconCondition()}
                    </>
                  );
                }}
              </FormDataConsumer>
              <br />
              <h3>內容</h3>
              <hr />
              <BooleanInput label="聲音" source="hasSound" />
              {formData.hasSound && soundInput(formData)}
              <hr />
              <BooleanInput label="圖文訊息" source="hasPopup" />
              {formData.hasPopup && popupInput()}
              <hr />
              <BooleanInput label="關閉圖文框" source="hasPopupDismissal" />
              {formData.hasPopupDismissal && popupDismissalInput()}
              <hr />
              <BooleanInput label="來電" source="hasIncomingCall" />
              {formData.hasIncomingCall && incomingCallInput()}
              <hr />
              <BooleanInput label="掛電話" source="hasHangUp" />
              {formData.hasHangUp && hangUpInput()}
              <hr />
              <BooleanInput label="新圖釘" source="hasMarker" />
              {formData.hasMarker && markerInput()}
              <hr />
              <BooleanInput label="移除圖釘" source="hasMarkerRemoval" />
              {formData.hasMarkerRemoval && markerRemovalInput()}
              <hr />
              <BooleanInput label="地圖樣式" source="hasMapStyle" />
              {formData.hasMapStyle && mapStyleInput()}
              <hr />
              <BooleanInput label="停止聲音" source="hasSilence" />
              {formData.hasSilence && silenceInput()}
            </>
          );
        }}
      </FormDataConsumer>
    </SimpleForm>
  );
};

export const BroadcastCreate = () => {
  return (
    <Create title={<Title />}>
      <InputForm showid="false" />
    </Create>
  );
};

export const BroadcastEdit = () => {
  return (
    <Edit title={<Title />}>
      <InputForm showid="true" />
    </Edit>
  );
};

function getCondition(currentNode, data) {
  const { locations, beacons } = data;
  if (currentNode.conditionType == "ALWAYS") {
    return { type: "ALWAYS" };
  } else {
    return {
      type: currentNode.conditionType,
      beaconId: currentNode.beacon
        ? beacons[currentNode.beacon].beaconId
        : null,
      threshold: currentNode.beaconThreshold,
      mode: currentNode.beaconType,
      location: currentNode.geofenceCenter
        ? locations[currentNode.geofenceCenter]
        : null,
      radius: currentNode.geofenceRadius || 14,
    };
  }
}

const getConditionIcon = (record) => {
  const delay =
    (record.hasSound && record.soundDelay) ||
    (record.hasHangUp && record.hangUpDelay) ||
    (record.hasIncomingCall && record.incomingCallDelay) ||
    (record.hasMarker && record.markerDelay) ||
    (record.hasMarkerRemoval && record.markerRemovalDelay) ||
    (record.hasPopup && record.popupDelay) ||
    (record.hasPopupDismissal && record.popupDismissalDelay) ||
    (record.hasMapStyle && record.mapStyleDelay);

  return (
    <>
      {record.conditionType == "TEXT" ? <ReplyIcon /> : <></>}
      {record.conditionType == "BEACON" ? <BluetoothIcon /> : <></>}
      {record.conditionType == "GEOFENCE" ? <MyLocationIcon /> : <></>}
      {record.conditionType == "ALWAYS" ? <ArrowForwardIcon /> : <></>}
      {delay ? <HourglassBottomIcon /> : <></>}
    </>
  );
};

function SendButton(props) {
  const record = useRecordContext(props);
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(true);
  const [loading, setLoading] = useState(false);
  const data = useAllData();
  const handleDialogClose = () => setOpen(false);
  const notify = useNotify();
  async function handleConfirm() {
    setOpen(false);
    setLoading(true);
    try {
      const condition = getCondition(record, data);
      const scenario = getCurrentScenario();
      const actions = getActions(record, data, condition).map((a) => ({
        ...a,
        session: {
          scenario: scenario,
          chapter: "",
        },
      }));
      const messages = actions.map((a) => {
        return {
          payload: {
            type: "PERFORM_DIRECTLY",
            action: a,
          },
          sender: "ghost",
          receiver: "?u",
          id: `perform-${a.id}`,
          scenarioId: scenario,
        };
      });
      const url = `${apiUrl}/v1/broadcast`;
      const responses = await Promise.all(
        messages.map((m) =>
          fetch(url, {
            method: "POST",
            body: JSON.stringify(m),
            headers: {
              "content-type": "application/json",
            },
          })
        )
      );
      const failed = responses.filter((response) => !response.ok);
      if (failed.length === 0) {
        notify(`成功傳送「${getRecordField(record, "name")}」`, {
          type: "success",
        });
      } else {
        notify("傳送失敗；原因 = " + failed.map((r) => r.status).join(", "), {
          type: "error",
        });
      }
    } catch (e) {
      console.error("failed to send", e);
      notify("傳送失敗；原因 = " + e, { type: "error" });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Button
        label="傳送"
        onClick={handleClick}
        disabled={loading || !data.loaded}
      />
      <Confirm
        isOpen={open}
        title="傳送"
        content={`你即將傳送「${getRecordField(
          record,
          "name"
        )}」給全部使用者。確定嗎？`}
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="確認傳送"
        cancel="取消"
      />
    </>
  );
}
