import React, {useState} from "react";
import Timeline from 'react-calendar-timeline';
import {subMonths, addMonths} from "date-fns";
import "react-calendar-timeline/lib/Timeline.css";

const TimelinePage = () => {
  const [groups] = useState([
    { id:1, title:"1"},
    { id:2, title:"2"},
  ]);

  const [items] = useState([
    {
      id:1,
      group: 1,
      title : "1",
      start_time : new Date(),
      end_time : new Date(new Date().getTime() + 60 * 60 * 1000),

    },
    {
      id: 2,
      group: 2,
      title: "2",
      start_time: new Date(),
      end_time: new Date(new Date().getTime() + 60 * 60 * 1000),
    }
  ]);

  return (<div style={{height: "500px"}}>TimelinePage
    <Timeline
      groups={groups}
      items={items}
      defaultTimeStart={subMonths(new Date(),1)}
      defaultTimeEnd={addMonths(new Date(), 1)}
      />
  
  </div>);

};

export default TimelinePage;
