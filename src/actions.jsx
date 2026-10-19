import * as React from "react";
import {
  ArrayInput,
  BooleanInput,
  SimpleFormIterator,
  Datagrid,
  List,
  Create,
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  EditButton,
  CreateButton,
  SelectInput,
  ReferenceInput,
  ReferenceArrayInput,
  ChipField,
  FormDataConsumer,
  required,
  FunctionField,
  AutocompleteArrayInput,
  ArrayField,
  ReferenceField,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  useRecordContext,
  DeleteWithConfirmButton,
  NumberInput,
} from "react-admin";

import {
  conditionTypes,
  getConditionIcon,
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
  introImageInput,
  buttonStyleInput,
  popupStyleInput,
  variableUpdateInput,
  modalImage,
  validateBeforeSubmit,
  comparisonTypes,
  endgameInput,
  guideImageInput,
  guideImageRemovalInput,
  silenceInput,
  getPrevDesc,
  longInputSx,
} from "./actionCommon";

import { getRecordField } from "./utils";
import { DummyList } from "./dummy";

const actionFilters = [
  <TextInput label="Search" source="name" alwaysOn key="name" />,
];

const Title = () => {
  const record = useRecordContext();
  return (
    <span>
      《{localStorage.getItem("scenarioName")}》動作
      {record && record.name ? `：'${record.name}'` : ""}
    </span>
  );
};
const getRowIndex = (record) => {
  const key = `a-${record.id}`;
  return <div>{localStorage.getItem(key)}</div>;
};

export const ActionList = () => {
  if (localStorage.getItem("scenario"))
    return (
      <List title={<Title />} perPage={100} filters={actionFilters}>
        <Datagrid rowClick={false}>
          <FunctionField label="編號" render={getRowIndex} />
          <TextField label="名稱" source="name" />
          <FunctionField label="條件" render={getConditionIcon} />
          <FunctionField label="內容" render={getContentIcon} />
          <EditButton label="編輯" />
          <ArrayField label="上一步" source="prevs">
            <Datagrid rowClick={false}>
              <ReferenceField label="" source="prev" reference="actions">
                <ChipField source="name" />
              </ReferenceField>
            </Datagrid>
          </ArrayField>
          <NextButton source="id" label="下一步" />
          <DeleteButton />
        </Datagrid>
      </List>
    );
  else return <DummyList />;
};

const DeleteButton = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <DeleteWithConfirmButton
      label="刪除"
      confirmContent="將刪除此動作，確定嗎？"
      confirmTitle={`確認刪除《${record.name}》`}
      translateOptions={{ name: record.name }}
    />
  );
};

// saves, then opens the create page with this action as the previous step
const ActionSaveButton = ({ label }) => {
  const notify = useNotify();
  const redirect = useRedirect();
  return (
    <SaveButton
      label={label}
      type="button"
      mutationOptions={{
        onSuccess: (data) => {
          // Edit is undoable: the update is sent when this notification closes
          notify("ra.notification.updated", {
            type: "info",
            messageArgs: { smart_count: 1 },
            undoable: true,
          });
          redirect("create", "actions", undefined, undefined, {
            record: { prevs: [{ prev: data.id, conditionType: "ALWAYS" }] },
          });
        },
      }}
    />
  );
};

const EditToolbar = () => {
  const record = useRecordContext();
  return (
    <Toolbar>
      <span>
        <SaveButton label="儲存" /> &nbsp;
        {record && record.id && <ActionSaveButton label="儲存並建下一步" />}
      </span>
    </Toolbar>
  );
};

const InputForm = (props) => {
  return (
    <SimpleForm validate={validateBeforeSubmit} toolbar={<EditToolbar />}>
      <FormDataConsumer>
        {({ formData }) => {
          const enableDelay =
            formData.prevs &&
            !formData.prevs.some(
              (c) =>
                !c ||
                c.conditionType == "GEOFENCE" ||
                c.conditionType == "BEACON"
            );
          const forbidDelay = !enableDelay && formData.prevs;

          const forbidDelayNotification = forbidDelay && (
            <>(因系統限制，Geofence和Beacon觸發時，無法使用延遲。)</>
          );
          console.log("prevs", formData.prevs);
          function prevRenderer(p) {
            return p.name + " ➜ " + getPrevDesc(p) + "之後";
          }
          return (
            <>
              {props.showid === "true" ? (
                <TextInput source="id" readOnly />
              ) : (
                <></>
              )}{" "}
              <br />
              <TextInput
                label="名稱"
                source="name"
                validate={[required()]}
              />{" "}
              <br />
              <h3>觸發順序</h3>
              <hr />
              <BooleanInput label="開頭" source="firstAction" /> <br />
              {formData.firstAction || (
                <ArrayInput label="前一步" source="prevs">
                  <SimpleFormIterator>
                    <ReferenceInput
                      source="prev"
                      reference="actions"
                      sort={{
                        field: "lastupdate",
                        order: "DESC",
                      }}
                      perPage={1000}
                    >
                      <SelectInput
                        label="接續"
                        sx={longInputSx}
                        optionText={prevRenderer}
                      />
                    </ReferenceInput>
                    <SelectInput
                      label="觸發條件"
                      source="conditionType"
                      choices={conditionTypes}
                    />
                    <FormDataConsumer>
                      {({
                        scopedFormData, // The data for this item of the ArrayInput
                      }) => (
                        <>
                          {scopedFormData &&
                            scopedFormData.conditionType === "GEOFENCE" &&
                            locationCondition()}
                          {scopedFormData &&
                            scopedFormData.conditionType === "BEACON" &&
                            beaconCondition()}
                          {scopedFormData &&
                            scopedFormData.conditionType === "TEXT" && (
                              <>
                                {!scopedFormData.fallback && (
                                  <TextInput
                                    multiline
                                    label="文字"
                                    source="userReply"
                                    validate={[required()]}
                                  />
                                )}
                                {
                                  <BooleanInput
                                    label="任意文字"
                                    source="fallback"
                                    defaultValue={
                                      scopedFormData.userReply === "fallback:"
                                    }
                                  />
                                }
                                {
                                  <BooleanInput
                                    label="設為變數"
                                    source="saveAsVariable"
                                  />
                                }
                                {scopedFormData.saveAsVariable && (
                                  <TextInput
                                    label="變數名"
                                    source="asVariable"
                                    validate={[required()]}
                                  />
                                )}
                              </>
                            )}
                        </>
                      )}
                    </FormDataConsumer>
                  </SimpleFormIterator>
                </ArrayInput>
              )}
              {!formData.firstAction && (
                <BooleanInput label="進階流程控制" source="advancedFlow" />
              )}
              {!formData.firstAction && formData.advancedFlow && (
                <>
                  <ReferenceArrayInput
                    source="exclusiveWith"
                    reference="actions"
                    sort={{
                      field: "lastupdate",
                      order: "DESC",
                    }}
                    perPage={1000}
                  >
                    <AutocompleteArrayInput label="互斥於" optionText="name" />
                  </ReferenceArrayInput>
                  <ArrayInput label="附加條件" source="preconditions">
                    <SimpleFormIterator>
                      <ReferenceInput
                        source="variable"
                        reference="variables"
                        sort={{
                          field: "lastupdate",
                          order: "DESC",
                        }}
                        perPage={1000}
                      >
                        <SelectInput label="變數" optionText="name" />
                      </ReferenceInput>
                      <SelectInput
                        label="比較"
                        source="comparison"
                        choices={comparisonTypes}
                      />
                      <NumberInput label="數值" source="value" />
                    </SimpleFormIterator>
                  </ArrayInput>
                </>
              )}
              <h3>常用內容</h3>
              {forbidDelayNotification}
              <hr />
              {modalImage}
              <BooleanInput label="聲音" source="hasSound" />
              {formData.hasSound && soundInput(formData, enableDelay)}
              <hr />
              <BooleanInput label="圖文訊息" source="hasPopup" />
              {formData.hasPopup && popupInput(formData, enableDelay)}
              <hr />
              <BooleanInput label="關閉圖文框" source="hasPopupDismissal" />
              {formData.hasPopupDismissal &&
                popupDismissalInput(formData, enableDelay)}
              <hr />
              <BooleanInput label="新圖釘" source="hasMarker" />
              {formData.hasMarker && markerInput(formData, enableDelay)}
              <hr />
              <BooleanInput label="移除圖釘" source="hasMarkerRemoval" />
              {formData.hasMarkerRemoval &&
                markerRemovalInput(formData, enableDelay)}
              <hr />
              {endgameInput(formData, enableDelay)}
              <hr />
              <h3>進階內容</h3>
              <BooleanInput label="開啟進階內容" source="advancedActionType" />
              {forbidDelayNotification}
              <hr />
              {formData.advancedActionType && (
                <>
                  <ReferenceInput
                    source="sender"
                    reference="people"
                    sort={{
                      field: "lastupdate",
                      order: "DESC",
                    }}
                    perPage={1000}
                  >
                    <SelectInput label="發送者" optionText="name" />
                  </ReferenceInput>
                  <BooleanInput label="停止聲音" source="hasSilence" />
                  {formData.hasSilence && silenceInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="指示圖" source="hasGuideImage" />
                  {formData.hasGuideImage &&
                    guideImageInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput
                    label="移除指示圖"
                    source="hasGuideImageRemoval"
                  />
                  {formData.hasGuideImageRemoval &&
                    guideImageRemovalInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="來電" source="hasIncomingCall" />
                  {formData.hasIncomingCall &&
                    incomingCallInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="掛電話" source="hasHangUp" />
                  {formData.hasHangUp && hangUpInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="地圖樣式" source="hasMapStyle" />
                  {formData.hasMapStyle && mapStyleInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="首頁背景" source="hasIntroImage" />
                  {formData.hasIntroImage &&
                    introImageInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="按鈕顏色" source="hasButtonStyle" />
                  {formData.hasButtonStyle &&
                    buttonStyleInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="視窗文字顏色" source="hasPopupStyle" />
                  {formData.hasPopupStyle &&
                    popupStyleInput(formData, enableDelay)}
                  <hr />
                  <BooleanInput label="更新變數" source="hasVariableUpdate" />
                  {formData.hasVariableUpdate && variableUpdateInput()}
                </>
              )}
            </>
          );
        }}
      </FormDataConsumer>
    </SimpleForm>
  );
};

export const ActionCreate = () => {
  return (
    <Create title={<Title />}>
      <InputForm showid="false" />
    </Create>
  );
};

export const ActionEdit = () => {
  return (
    <Edit title={<Title />}>
      <InputForm showid="true" />
    </Edit>
  );
};

function NextButton(props) {
  const record = useRecordContext(props);
  return (
    <CreateButton
      label="下一步"
      to="/actions/create"
      state={{
        record: {
          prevs: [
            {
              prev: getRecordField(record, "id"),
              conditionType: "ALWAYS",
            },
          ],
        },
      }}
    />
  );
}
