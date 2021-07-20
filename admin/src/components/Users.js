import {
  Create,
  SimpleForm,
  TextInput,
  Edit,
  List,
  Show,
  Datagrid,
  TextField,
  DateField,
  ReferenceManyField,
  SimpleShowLayout,
  ChipField,
  required,
} from "react-admin";

import { IDTitle, IDField } from "./utils/id.js";

export function UserList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="username" />
        <IDField source="id" />
      </Datagrid>
    </List>
  );
}

export function UserShow(props) {
  return (
    <Show title={<IDTitle name="User" />} {...props}>
      <SimpleShowLayout>
        <IDField source="id" />
        <TextField source="username" />
        <ReferenceManyField
          reference="achievements"
          target="owner_id"
          label="Achievements"
        >
          <Datagrid rowClick={(id, basePath, record) => `${basePath}/${record.owner_id},${record.id}/show`}>
            <IDField source="id" />
            <ChipField source="name" />
            <DateField source="timestamp" showTime />
            <TextField source="tags" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
}

export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
    </SimpleForm>
  </Create>
);

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <IDField disabled source="id" />
      <TextInput source="username" validate={required()} />
    </SimpleForm>
  </Edit>
);
