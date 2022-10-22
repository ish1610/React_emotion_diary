import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import DiaryDispatchContext from "../store/diaryDispatchContext";

import Button from "./Button";
import EmotionItem from "./EmotionItem";
import Header from "./Header";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

const DiaryEditor = ({ isEdit, originData }) => {
  const { onRemove } = useContext(DiaryDispatchContext);
  const { onCreate, onEdit } = useContext(DiaryDispatchContext);

  const [date, setDate] = useState(getStringDate(new Date()));
  const [emotion, setEmotion] = useState(3);
  const [content, setContent] = useState("");

  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion);
  }, []);

  const navigate = useNavigate();

  const contentRef = useRef();

  const handleSubmit = () => {
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }

    if (
      window.confirm(
        isEdit ? "일기를 수정하기겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
        console.log(emotion);
      }
    }
    navigate("/", { replace: true });
  };

  const handleRemove = () => {
    if (window.confirm("일기를 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(+originData.date)));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);

  return (
    <div className="DiaryEditor">
      <Header
        headText={isEdit ? "일기 수정하기" : " 일기 작성하기"}
        leftChild={<Button text={"< 뒤로가기"} onClick={() => navigate(-1)} />}
        rightChild={
          isEdit && (
            <Button
              type={"nagative"}
              text={"삭제하기"}
              onClick={handleRemove}
            />
          )
        }
      />

      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input
              className="input_date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </section>

        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickEmote}
                isSelected={it.emotion_id === emotion}
              />
            ))}
          </div>
        </section>

        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box_text_wrapper">
            <textarea
              ref={contentRef}
              placeholder="오늘은 어떠셨나요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>

        <section>
          <div className="control_box">
            <Button
              text={"취소하기"}
              onClick={() => {
                navigate(-1);
              }}
            />
            <Button
              type={"positive"}
              text={"작성완료"}
              onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiaryEditor;
