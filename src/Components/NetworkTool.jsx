import React, { useEffect, useState } from 'react'
import styles from "./NetworkTool.module.css"
import axios from 'axios';
import { useSelector } from 'react-redux';



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
    { heading: "Other", value: "other" }
];
function NetworkTool() {

    const data=useSelector((store)=>store.requestDetails);
    const [detailsFilter, setDetailsFilter] = useState([])
    const[link,setLink]=useState("");
    const [filter, setFilter] = useState("all")
    const [rightSide, setRightSide] = useState(false)
    const [requestData, setRequestData] = useState({})
    const [section, setSection] = useState("Headers")


    const handelRequest=async ()=>{
        try {
            const res=await axios.get(link);
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (filter === "all") {
            setDetailsFilter(data)
        } else {
            const filter = data.filter((ele) => {
                return ele.type === filter
            })
            setDetailsFilter(filter)
        }

    }, [filter, data])

    const handleClick = (e) => {
        setRightSide(true)
        setRequestData(e)
    }
    const handleSelectSection = (e) => {
        setSection(e)
    }
    const isValidJSON = (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    };
  return (
    <div className={styles.Container}>
        <div className={styles.upperSection}>
        <input type="text" placeholder='Filter' className={styles.filterInput} />
                <div>
                    <input type="checkbox"/>
                    <label> Invert</label>
                </div>
                <div>
                    <input type="checkbox" />
                    <label >Hide data URLs</label>
                </div>
                <div>
                    <input type="checkbox" />
                    <label >Hide extension URLs</label>
                </div>

                <div className={styles.Input}>
                    <input type="text" placeholder='Enter Api' onChange={(e) => setLink(e.target.value)} value={link} className={styles.filterInput}  />
                    <button onClick={()=>handelRequest()}>Test</button>
                </div>
        </div>


        <div className={styles.midSection}>
                <div>
                    {requestType.map((ele, ind) => {
                        return (
                            <span className={styles.Requests} key={ind} style={{ backgroundColor: filter === ele.value ? "rgb(114,114,114)" : "" }} onClick={() => setFilter(ele.value)}>{ele.heading}</span>
                        )
                    })}
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

            <div className={styles.line}> </div>
            {
                detailsFilter.length === 0 ? (<div className={styles.part1}>
                    <div className={styles.part2}>
                        <p>
                            Recording network activity......
                        </p>
                        <p>Perform a request or hit R to record the reload.</p>
                        <a href="#">Learn more</a>
                    </div>
                </div>):""}
    </div>
  )
}

export default NetworkTool