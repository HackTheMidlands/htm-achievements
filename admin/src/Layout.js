import { AppBar, Layout } from "react-admin";

function MyAppBar(props) {
  return <AppBar color="primary" {...props} />;
}

export default function MyLayout(props) {
  return <Layout {...props} appBar={MyAppBar} />;
}
