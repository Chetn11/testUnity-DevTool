import React from "react";
import styles from "./NetworkTool.module.css";

function ResponseDetails({
  section,
  selectedItem,
  setRightSide,
  handleSelectSection,
}) {
  return (
    <div className={styles.responseDetails}>
      <div className={styles.responseHeader}>
        <span onClick={() => setRightSide(false)}>⨉</span>
        {["Headers", "Preview", "Response", "Initiator", "Timing"].map(
          (e, ind) => {
            return (
              <span
                key={ind}
                onClick={() => handleSelectSection(e)}
                className={section === e ? styles.selectedSection : ""}
              >
                {e}
              </span>
            );
          }
        )}
      </div>
      <div className={styles.responseCard}>
        {section === "Headers" && (
          <div className={styles.headers}>
            <div>
              <span>Request URL</span>
              <span>{selectedItem.headers?.["x-final-url"]}</span>
            </div>
            <div>
              <span>Request Method</span>
              <span>{selectedItem.config?.method || "N/A"}</span>
            </div>
            <div>
              <span>Status</span>
              <span>
                {selectedItem.status} {selectedItem.statusText}
              </span>
            </div>
            <div>
              <span>Duration</span>
              <span>{Math.round(selectedItem.duration || 0)}ms</span>
            </div>
            <div>
              <span>Age</span>
              <span>{selectedItem.headers?.age}</span>
            </div>
          </div>
        )}
        {section === "Preview" && <pre>No preview</pre>}
        {section === "Response" && <pre>{selectedItem.data}</pre>}
        {section === "Initiator" && (
          <div>
            <h1 style={{ color: "gray", textAlign: "center" }}>
              This request has no initiator data.
            </h1>
          </div>
        )}
        {section === "Timing" && (
          <div style={{ fontSize: "larger", padding: "10px" }}>
            Request has taken {Math.round(selectedItem.duration || 0)} ms to
            complete.
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseDetails;
