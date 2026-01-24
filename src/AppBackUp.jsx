import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [records, setRecords] = useState([])

  const onChangeTitle = (e) => setTitle(e.target.value)
  const onChangeTime = (e) => setTime(e.target.value)
  const onClickAdd = () => {
    if (!title || !time) return
    const newRecords = [...records, { title, time: Number(time) }]
    setRecords(newRecords)
    setTitle('')
    setTime('')
  }

  const totalTime = records.reduce((sum, record) => sum + Number(record.time || 0), 0)

  return (
    <>
      <h3>サンプル</h3>
      <div>内容：<input value={title} onChange={onChangeTitle} /></div>
      <div>時間：<input value={time} onChange={onChangeTime} />時間</div>
      <button onClick={onClickAdd}>登録</button>
      {(!title || !time) && <p>＊未入力あり</p>}
      <div>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              内容：{record.title}、時間：{record.time}時間
            </li>
          ))}
        </ul>
      </div>
      <div>合計：{totalTime}時間</div>
    </>
  )
}

