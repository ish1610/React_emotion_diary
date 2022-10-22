import React, { useCallback, useEffect, useReducer, useRef } from "react";
import DiaryDispatchContext from "./diaryDispatchContext";

const dataReducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const newItem = {
        ...action.data,
      };
      newState = [newItem, ...state];
      break;
    }
    case "REMOVE": {
      newState = state.filter((it) => it.id !== action.id);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

const DiaryDispatchProvider = (props) => {
  const [data, dispatchData] = useReducer(dataReducer, []);

  const dataId = useRef(6);

  useEffect(() => {
    const localData = localStorage.getItem("diary");
    if (localData) {
      const diaryList = JSON.parse(localData).sort((a, b) => +b.id - +a.id);
      dataId.current = +diaryList[0].id + 1;

      dispatchData({ type: "INIT", data: diaryList });
    }
  }, []);

  // CREATE
  const onCreate = useCallback((date, content, emotion) => {
    dispatchData({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    dataId.current += 1;
  }, []);

  // REMOVE
  const onRemove = useCallback((id) => {
    dispatchData({ type: "REMOVE", id });
  }, []);

  // EDIT
  const onEdit = useCallback((id, date, content, emotion) => {
    dispatchData({
      type: "EDIT",
      data: { id, date: new Date(date).getTime(), content, emotion },
    });
    // console.log(emotion);
  }, []);

  const dispatchContext = {
    data: data,
    onCreate: onCreate,
    onEdit: onEdit,
    onRemove: onRemove,
  };

  console.log(data);

  return (
    <DiaryDispatchContext.Provider value={dispatchContext}>
      {props.children}
    </DiaryDispatchContext.Provider>
  );
};

export default DiaryDispatchProvider;
