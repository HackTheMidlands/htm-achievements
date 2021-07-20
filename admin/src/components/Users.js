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

export function UserList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="username" />
        <TextField source="id" />
      </Datagrid>
    </List>
  );
}

export function UserShow(props) {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="username" />
        <ReferenceManyField
          reference="achievements"
          target="users"
          label="Achievements"
        >
          <Datagrid rowClick="show">
            <TextField source="id" />
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
      <TextInput disabled source="id" />
      <TextInput source="username" validate={required()} />
    </SimpleForm>
  </Edit>
);
