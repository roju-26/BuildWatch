import { useState } from "react";
import { submitFollowUp } from "../services/api";

export default function FollowUpUpload({ caseId, onDone }) {
  const [image, setImage] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!image) return setError("Please choose a follow-up photograph.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("note", note);

    try {
      setLoading(true);
      await submitFollowUp(caseId, formData);
      setImage(null);
      setNote("");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="followup-form">
      <h3>Add a follow-up photo</h3>
      <p className="sub-text">
        Take the photo from the same spot and angle as the original, so the
        comparison is fair.
      </p>

      <label className="dropzone">
        <span className="icon">📷</span>
        {image ? image.name : "Click to upload a follow-up photo"}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>
      {image && (
        <img
          className="preview"
          src={URL.createObjectURL(image)}
          alt="follow-up preview"
        />
      )}

      <div className="field" style={{ marginTop: 14 }}>
        <label>Note (optional)</label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="For example: partly cleared, rods still on the road"
        />
      </div>

      {error && <div className="alert-error">{error}</div>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Uploading..." : "Upload follow-up"}
      </button>
    </form>
  );
}
