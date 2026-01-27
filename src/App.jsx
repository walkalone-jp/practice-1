import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [records, setRecords] = useState([])
  const [error, setError] = useState(null)
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const onChangeTitle = (e) => setTitle(e.target.value)
  const onChangeTime = (e) => setTime(e.target.value)
  const handleDelete = async (id) => {
    const { error: deleteError } = await supabase
      .from("study-record")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setRecords((prevRecords) =>
      prevRecords.filter((r) => r.id !== id)
    );
  };

  // 追加（INSERT）
  const onClickAdd = async () => {
    if (!title || !time) return

    const { data, error } = await supabase
      .from("study-record")
      .insert({ title, time: Number(time) })
      .select("id, title, time")
      .single()

    if (error) {
      setError(error.message)
      return
    }

    setError(null)
    setTitle('')
    setTime('')

    if (data) {
      setRecords((prev) => [data, ...prev])
    }
  }

  const totalTime = records.reduce(
    (sum, record) => sum + Number(record.time || 0), 0
  )

  // 一覧取得（SELECT）
  const fetchNotes = async () => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from("study-record")
      .select("id, title, time")

    if (error) {
      setError(error.message)
      setRecords([])
    } else {
      setError(null)
      setRecords(data ?? [])  // dataがnullの場合は空配列をセット
    }

    setIsLoading(false)
  };

  // 初回レンダリング時に一覧取得
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <h3>サンプル</h3>
      <div>内容：<input value={title} onChange={onChangeTitle} /></div>
      <div>時間：<input value={time} onChange={onChangeTime} /> 時間</div>
      <button onClick={onClickAdd}>登録</button>
      {error && <p style={{ color: "red" }}>エラー: {error}</p>}
      {(!title || !time) && <p>＊未入力あり</p>}
      {isLoading && <p>Loading...</p>}
      <div>
        <ul>
          {records.map((record) => (
            <li key={record.id}>
              内容：{record.title}、時間：{record.time}時間
              <button
                style={{ marginLeft: "20px" }}
                onClick={() => handleDelete(record.id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>合計：{totalTime}時間</div>
    </>
  )
}



