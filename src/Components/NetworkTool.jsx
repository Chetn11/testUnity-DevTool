import React, { useEffect, useState } from "react";
import styles from "./NetworkTool.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../Redux/action";
import ResponseDetails from "./ResponseDetails";

let requestType = [
  { heading: "All", value: "all" },
  { heading: "Fetch/XHR", value: "fetch/xhr" },
  { heading: "Doc", value: "doc" },
  { heading: "CSS", value: "css" },
  { heading: "JS", value: "js" },
  { heading: "Font", value: "font" },
  { heading: "Img", value: "image" },
  { heading: "Media", value: "media" },
  { heading: "Manifest", value: "manifest" },
  { heading: "WS", value: "ws" },
  { heading: "Wasm", value: "wasm" },
  { heading: "Other", value: "other" },
];

function NetworkTool() {
  const { response, fetchedData } = useSelector(
    (store) => store.reducer.response
  );
  const dispatch = useDispatch();

  const [link, setLink] = useState("");
  const [filter, setFilter] = useState("all");
  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for details
  const [rightSide, setRightSide] = useState(false);
  const [section, setSection] = useState("Headers");

  const handelRequest = async (e) => {
    e.preventDefault();
    try {
      await dispatch(getData(link));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (filter === "all") {
      setFilterData(fetchedData);
    } else {
      const data = fetchedData.filter((ele) => {
        return ele.type === filter;
      });
      setFilterData(data);
    }
  }, [response, filter]);

  const handleDetails = (item) => {
    setRightSide(true);
    setSelectedItem(item);
  };

  const handleSelectSection = (val) => {
    setSection(val);
  };
  console.log(filter);
  console.log(fetchedData);
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

      {!fetchedData ? (
        <div className={styles.part1}>
          <div className={styles.part2}>
            <p>Recording network activity......</p>
            <p>Perform a request or hit R to record the reload.</p>
            <a href="#">Learn more</a>
          </div>
        </div>
      ) : (
        <div className={styles.tableBox}>
          <table
            className={styles.table}
            style={{ width: rightSide ? "50%" : "100%" }}
          >
            <thead>
              <tr style={{ fontSize: "larger" }}>
                <td>Name</td>
                {!rightSide && (
                  <>
                    <td>Status</td>
                    <td>Method</td>
                    <td>Type</td>
                    <td>Initiator</td>
                    <td>Time</td>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filterData?.map((ele, ind) => {
                return (
                  <>
                    {ele.url && (
                      <tr key={ind}>
                        <td
                          onClick={() => handleDetails(response)}
                          style={{ cursor: "pointer" }}
                        >
                          {ele.url || "Unnamed Request"}
                        </td>
                        {!rightSide && (
                          <>
                            <td>{response.status}</td>
                            <td>{response.config?.method || "N/A"}</td>
                            <td>{ele.type}</td>
                            <td>
                              {response.headers?.["x-final-url"] || "N/A"}
                            </td>
                            <td>{Math.round(response.duration || 0)} ms</td>
                          </>
                        )}
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
          {rightSide && (
            <ResponseDetails
              section={section}
              selectedItem={selectedItem}
              setRightSide={setRightSide}
              handleSelectSection={handleSelectSection}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default NetworkTool;
