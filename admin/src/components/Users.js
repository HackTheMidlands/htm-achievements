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
        <IDField source="id" />
        <TextField source="discord_username" />
        <TextField source="twitter_username" />
      </Datagrid>
    </List>
  );
}

export function UserShow(props) {
  return (
    <Show title={<UserTitle />} {...props}>
      <SimpleShowLayout>
        <IDField source="id" />
        <TextField source="discord_username" />
        <TextField source="twitter_username" />
        <ReferenceManyField
          reference="achievements"
          target="owner_id"
          label="Achievements"
        >
          <Datagrid
            rowClick={(id, basePath, record) =>
              `${basePath}/${record.owner_id},${record.id}/show`
            }
          >
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

export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <IDField disabled source="id" />
      <TextInput source="discord_id" />
      <TextInput source="discord_username" />
      <TextInput source="twitter_id" />
      <TextInput source="twitter_username" />
    </SimpleForm>
  </Edit>
);

export function displayUsername(record) {
  if (record.discord_username) {
    return `discord:${record.discord_username}`;
  } else if (record.twitter_username) {
    return `twitter:${record.twitter_username}`;
  } else {
    return `#${record.id}`;
  }
}

function UserTitle({ record }) {
  return <span>User {displayUsername(record)}</span>;
}
