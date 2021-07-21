import {
  List,
  SelectInput,
  FunctionField,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  ChipField,
  DateField,
  ReferenceField,
  Create,
  SimpleForm,
  ReferenceInput,
  TextInput,
} from "react-admin";
import { JsonField, JsonInput } from "react-admin-json-view";
import { displayUsername } from "./Users.js";

import { IDTitle, IDField } from "./utils/id.js";

function TagsField({ source, ...props }) {
  return (
    <JsonField
      source={source}
      reactJsonOptions={{
        name: null,
        collapsed: false,
        enableClipboard: false,
        displayDataTypes: false,
      }}
      {...props}
    />
  );
}
TagsField.defaultProps = {
  label: "Tags",
  addLabel: true,
};

function TagsInput({ source, ...props }) {
  return (
    <JsonInput
      source={source}
      reactJsonOptions={{
        name: null,
        collapsed: false,
        enableClipboard: false,
        displayDataTypes: false,
      }}
      {...props}
    />
  );
}

export function AchievementList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <IDField source="id" />
        <ChipField source="name" />
        <ReferenceField source="owner_id" reference="users">
          <FunctionField render={displayUsername} />
        </ReferenceField>
        <DateField source="updated_at" showTime />
        <TagsField source="tags" />
      </Datagrid>
    </List>
  );
}

export function AchievementShow(props) {
  return (
    <Show title={<IDTitle name="Achievement" />} {...props}>
      <SimpleShowLayout>
        <IDField source="id" />
        <ChipField source="name" />
        <ReferenceField source="owner_id" reference="users" link="show">
          <FunctionField render={displayUsername} />
        </ReferenceField>
        <DateField source="created_at" showTime />
        <DateField source="updated_at" showTime />
        <TagsField source="tags" />
      </SimpleShowLayout>
    </Show>
  );
}

export const AchievementCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="owner_id" reference="users">
        <SelectInput optionText={displayUsername} />
      </ReferenceInput>
      <TextInput source="name" />
      <TagsInput source="tags" />
    </SimpleForm>
  </Create>
);
