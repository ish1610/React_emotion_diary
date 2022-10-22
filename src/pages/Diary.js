import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Header from "../components/Header";
import DiaryDispatchContext from "../store/diaryDispatchContext";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

// 상세 페이지의 역할을 함, 어떤 일기를 보여줘야 할지 전달 받아야함
// ex) /diary/1 -> 1번 일기 보여줌
const Diary = () => {
  const { id } = useParams();
  const { data } = useContext(DiaryDispatchContext);
  const navigate = useNavigate();
  const [diaryData, setDiaryData] = useState();

  useEffect(() => {
    if (data.length >= 1) {
      const targetDiary = data.find((it) => +it.id === +id);
      // console.log(targetDiary);

      if (targetDiary) {
        // 존재하는 일기를 찾으면 State에 할당
        setDiaryData(targetDiary);
      } else {
        alert("없는 일기입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [id, data]);

  if (!diaryData) {
    return <div className="DiaryPage">로딩 중입니다...</div>;
  } else {
    const curEmotionData = emotionList.find(
      (it) => +it.emotion_id === +diaryData.emotion
    );

    return (
      <div className="DiaryPage">
        <Header
          headText={`${getStringDate(new Date(diaryData.date))} 기록`}
          leftChild={
            <Button text={"< 뒤로가기"} onClick={() => navigate(-1)} />
          }
          rightChild={
            <Button
              text={"수정하기"}
              onClick={() => navigate(`/edit/${diaryData.id}`)}
            />
          }
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            <div
              className={`diary_img_wrapper diary_img_wrapper_${diaryData.emotion}`}
            >
              <img
                src={curEmotionData.emotion_img}
                alt={curEmotionData.emotion_descript}
              />

              <div className="emotion_descript">
                {curEmotionData.emotion_descript}
              </div>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            <div className="diary_content_wrapper">
              <p>{diaryData.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
};

export default Diary;
