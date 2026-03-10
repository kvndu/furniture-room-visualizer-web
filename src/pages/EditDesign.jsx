import { useParams } from "react-router-dom";

export default function EditDesign() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1 className="title">Edit Design</h1>
          <p className="subtitle">
            Editing design ID: {id}
          </p>

          <p>
            This feature can be extended to reload the design layout and update furniture.
          </p>
        </div>
      </div>
    </div>
  );
}