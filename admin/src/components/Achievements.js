import {
  List,
  SelectInput,
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

import { IDTitle, IDField } from "./utils/id.js";

export function AchievementList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <IDField source="id" />
        <ChipField source="name" />
        <ReferenceField source="owner_id" reference="users">
          <TextField source="username" />
        </ReferenceField>
        <DateField source="timestamp" showTime />
        <TextField source="tags" />
      </Datagrid>
    </List>
  );
}

export function AchievementShow(props) {
  return (
    <Show title={<IDTitle name="Achievement"/>} {...props}>
      <SimpleShowLayout>
        <IDField source="id" />
        <ChipField source="name" />
        <ReferenceField source="owner_id" reference="users">
          <TextField source="username" />
        </ReferenceField>
        <DateField source="timestamp" showTime />
        <TextField source="tags" />
      </SimpleShowLayout>
    </Show>
  );
}

export const AchievementCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="user" reference="users">
        <SelectInput optionText="username" />
      </ReferenceInput>
      <TextInput source="name" />
      <TextInput source="tags" />
    </SimpleForm>
  </Create>
);