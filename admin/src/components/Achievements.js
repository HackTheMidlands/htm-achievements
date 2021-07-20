import {
  List,
  Datagrid,
  TextField,
  Show,
  SimpleShowLayout,
  ChipField,
  DateField,
  ReferenceField,
} from "react-admin";

export function AchievementList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" />
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
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
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
