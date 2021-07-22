import {
  List,
  Datagrid,
  TextField,
  ChipField,
  ReferenceField,
} from "react-admin";

export function PendingAchievementList(props) {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="user_reference" />
        <ReferenceField source="id" reference="achievements" link="show">
          <ChipField source="name" />
        </ReferenceField>
      </Datagrid>
    </List>
  );
}
