import { useRecordContext } from 'react-admin';

export function extractID(fullID) {
    const idParts = fullID.split(",");
    const id = idParts[idParts.length - 1];
    return id;
}

export function IDTitle({ name, record }) {
    return <span>{name} #{extractID(record.id)}</span>
}

export function IDField(props) {
    const { source } = props;
    const record = useRecordContext(props);
    const id = extractID(record[source])

    return (
        <span>{id}</span>
    )
}
IDField.defaultProps = {
    addLabel: true,
    label: 'ID',
};