function formatDate(value) {
  return new Date(value).toLocaleString();
}

export default function BeforeAfter({ beforeImage, beforeDate, followUps }) {
  if (!followUps || followUps.length === 0) {
    return <p className="sub-text">No follow-up photos yet.</p>;
  }

  // Show the most recent follow-up against the original photo.
  const latest = followUps[followUps.length - 1];

  return (
    <div>
      <div className="compare">
        <figure>
          <img src={beforeImage} alt="Before" />
          <figcaption>
            <b>Before</b>
            <span>{formatDate(beforeDate)}</span>
          </figcaption>
        </figure>
        <figure>
          <img src={latest.image} alt="After" />
          <figcaption>
            <b>Latest follow-up</b>
            <span>{formatDate(latest.created_at)}</span>
          </figcaption>
        </figure>
      </div>

      <div className="compare-result">
        <span className={`badge removal-${latest.removal_status}`}>
          AI suggests: {latest.removal_status}
        </span>
        <span className="similarity">
          Image similarity: {Math.round(latest.image_similarity * 100)}%
        </span>
      </div>

      {latest.note && <p className="followup-note">Note: {latest.note}</p>}

      <p className="disclaimer">
        This is an AI suggestion only. Differences in camera angle, lighting,
        image quality and GPS accuracy can affect it. An administrator verifies
        the final result.
      </p>

      {followUps.length > 1 && (
        <p className="sub-text">
          {followUps.length} follow-up photos have been uploaded.
        </p>
      )}
    </div>
  );
}
