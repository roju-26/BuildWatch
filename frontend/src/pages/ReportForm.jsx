import { useState } from "react";
import LocationPicker from "../components/LocationPicker";
import { PUBLIC_AREA_TYPES, ROLES } from "../constants";
import { createReport } from "../services/api";

export default function ReportForm() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [areaType, setAreaType] = useState("FOOTPATH");
  // [DECISION REQUIRED] How reporter_role is set (login vs. selection) is not defined yet.
  const [role, setRole] = useState(ROLES.CITIZEN);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function handlePick(lat, lng) {
    setLatitude(lat);
    setLongitude(lng);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => handlePick(pos.coords.latitude, pos.coords.longitude),
      () => setError("Could not get your location. Click on the map instead."),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!image) return setError("Please upload a photograph.");
    if (latitude === null)
      return setError("Please choose a location on the map.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("public_area_type", areaType);
    formData.append("reporter_role", role);

    try {
      setLoading(true);
      const data = await createReport(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Report an Obstruction</h2>

      <div className="field">
        <label>Reporter role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value={ROLES.CITIZEN}>Citizen</option>
          <option value={ROLES.FIELD_WORKER}>Field worker</option>
        </select>
      </div>

      <div className="field">
        <span className="label">Photograph</span>
        <label className="dropzone">
          <span className="icon">📷</span>
          {image ? image.name : "Click to upload a photo of the obstruction"}
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
            alt="preview"
          />
        )}
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the obstruction"
        />
      </div>

      <div className="field">
        <label>Affected public area</label>
        <select value={areaType} onChange={(e) => setAreaType(e.target.value)}>
          {PUBLIC_AREA_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <span className="label">Location (click on the map)</span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={useMyLocation}
        >
          📍 Use my location
        </button>
        <div className="map-wrap">
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onPick={handlePick}
          />
        </div>
        {latitude !== null && (
          <p className="coords">
            Selected: {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </p>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit report"}
      </button>

      {result && (
        <div className="alert-success">
          ✅ Report submitted successfully
          <br />
          <span className="case-id">{result.case_id}</span>
        </div>
      )}
    </form>
  );
}
