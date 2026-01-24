import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // 一覧取得（SELECT）
  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("id, content, created_at")
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }
    setNotes(data ?? []);  // dataがnullの場合は空配列をセット
  };

  // 追加（INSERT）
  const addNote = async () => {
    setError("");  // エラーメッセージをクリア

    // 空文字チェック
    if (!content.trim()) {
      setError("content is empty");  // エラーメッセージをセット
      return;
    }

    // データ追加
    const { error } = await supabase
      .from("notes")
      .insert({ content });

    if (error) {
      setError(error.message);
      return;
    }

    setContent("");
    await fetchNotes(); // 再取得
  };

  // 初回レンダリング時に一覧取得
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <main style={{ padding: 16 }}>
      <h1>Notes</h1>

      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="new note"
      />
      <button onClick={addNote}>add</button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            {n.content} ({new Date(n.created_at).toLocaleString()})
          </li>
        ))}
      </ul>
    </main>
  );
}