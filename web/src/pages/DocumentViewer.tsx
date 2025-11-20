import { useParams } from 'react-router-dom';

export default function DocumentViewer() {
    const { id } = useParams();
    return <div className="p-6">Viewing Document: {id}</div>;
}
