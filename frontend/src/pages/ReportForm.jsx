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
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}
    >
      <h2>Report an Obstruction</h2>

      <label>Reporter role</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value={ROLES.CITIZEN}>Citizen</option>
        <option value={ROLES.FIELD_WORKER}>Field worker</option>
      </select>

      <label>Photograph</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          style={{ maxWidth: "100%", marginTop: 8 }}
        />
      )}

      <label>Description</label>
      <textarea
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the obstruction"
      />

      <label>Affected public area</label>
      <select value={areaType} onChange={(e) => setAreaType(e.target.value)}>
        {PUBLIC_AREA_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label>Location (click on the map)</label>
      <button type="button" onClick={useMyLocation}>
        Use my location
      </button>
      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onPick={handlePick}
      />
      {latitude !== null && (
        <p>
          Selected: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit report"}
      </button>

      {result && (
        <p>
          Report submitted. Case ID: <b>{result.case_id}</b>
        </p>
      )}
    </form>
  );
}
