import React, { useEffect, useState } from "react";
import styles from "./NetworkTool.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Redux/action";

let requestType = [
  { heading: "All", value: "all" },
  { heading: "Fetch/XHR", value: "fetch" },
  { heading: "Doc", value: "document" },
  { heading: "CSS", value: "style" },
  { heading: "JS", value: "script" },
  { heading: "Font", value: "font" },
  { heading: "Img", value: "image" },
  { heading: "Media", value: "media" },
  { heading: "Manifest", value: "manifest" },
  { heading: "WS", value: "websocket" },
  { heading: "Wasm", value: "wasm" },
  { heading: "Other", value: "other" },
];

function NetworkTool() {
  const response = useSelector((store) => store.reducer.response);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [link, setLink] = useState("");
  const [filter, setFilter] = useState("all");
  const [rightSide, setRightSide] = useState(false);
  

  const handelRequest = async (e) => {
    e.preventDefault();
    try {
      await dispatch(getData(link));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (response) {
      setData((prevData) => [...prevData, response]);
    }
  }, [response]);

  const handleClick = (e) => {
    setRightSide(true);
    
  };



  return (
    <div className={styles.Container}>
      <div className={styles.upperSection}>
        <input
          type="text"
          placeholder="Filter"
          className={styles.filterInput}
        />
        <div>
          <input type="checkbox" />
          <label> Invert</label>
        </div>
        <div>
          <input type="checkbox" />
          <label>Hide data URLs</label>
        </div>
        <div>
          <input type="checkbox" />
          <label>Hide extension URLs</label>
        </div>

        <div className={styles.Input}>
          <input
            type="text"
            placeholder="Enter Api"
            onChange={(e) => setLink(e.target.value)}
            value={link}
            className={styles.filterInput}
          />
          <button onClick={handelRequest}>Test</button>
        </div>
      </div>

      <div className={styles.midSection}>
        <div>
          {requestType.map((ele, ind) => (
            <span
              className={styles.Requests}
              key={ind}
              style={{
                backgroundColor: filter === ele.value ? "rgb(114,114,114)" : "",
              }}
              onClick={() => setFilter(ele.value)}
            >
              {ele.heading}
            </span>
          ))}
        </div>
        <div className={styles.Options}>
          <input type="checkbox" />
          Blocked response cookies
        </div>
        <div className={styles.Options}>
          <input type="checkbox" />
          Blocked requests
        </div>
        <div className={styles.Options}>
          <input type="checkbox" />
          3rd-party request
        </div>
      </div>

      <div className={styles.line}></div>
      {data.length === 0 ? (
        <div className={styles.part1}>
          <div className={styles.part2}>
            <p>Recording network activity......</p>
            <p>Perform a request or hit R to record the reload.</p>
            <a href="#">Learn more</a>
          </div>
        </div>
      ) : (
        <div className={styles.requestPanel}>
          <table
            className={styles.table}
            style={{ width: rightSide ? "20%" : "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "larger" }}>
                <td>Name</td>
                {!rightSide && (
                  <>
                    <td>Status</td>
                    <td>Type</td>
                    <td>Initiator</td>
                    <td>Size</td>
                    <td>Time</td>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((ele, ind) => {
                const urlParts = ele.config?.url.split("https://");
                
                if (urlParts) {
                  const secondPart = urlParts[2];
                  console.log(secondPart);

                  return (
                    <tr key={ind}>
                      <td
                        
                        style={{ cursor: "pointer" }}
                      >
                        {secondPart || "Unnamed Request"}
                      </td>
                      {!rightSide && (
                        <>
                          <td>{ele.status}</td>
                          <td>{ele.config?.method || "N/A"}</td>
                          <td>{secondPart || "N/A"}</td>
                          <td>{Math.round((ele.request?.response|| 0) / 1024)} Kb</td>
                          <td>{Math.round(ele.duration || 0)} ms</td>
                        </>
                      )}
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NetworkTool;
