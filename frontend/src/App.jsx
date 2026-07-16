import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import BoardView from "./components/BoardView";
import * as api from "./data/api";

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshBoards = async () => {
    const b = await api.getBoards();
    setBoards(b);
    if (!activeBoardId && b.length > 0) setActiveBoardId(b[0].id);
    setLoading(false);
  };

  useEffect(() => {
    refreshBoards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (name) => {
    const board = await api.createBoard(name);
    await refreshBoards();
    setActiveBoardId(board.id);
  };

  const handleDelete = async (id) => {
    await api.deleteBoard(id);
    const b = await api.getBoards();
    setBoards(b);
    if (activeBoardId === id) setActiveBoardId(b[0]?.id || null);
  };

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  if (loading) {
    return (
      <div className="app-shell">
        <div className="empty-state" style={{ margin: "auto" }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        boards={boards}
        activeBoardId={activeBoardId}
        onSelect={setActiveBoardId}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />
      {activeBoard ? (
        <BoardView key={activeBoard.id} board={activeBoard} />
      ) : (
        <div className="board-view">
          <div className="empty-state" style={{ margin: "auto" }}>
            No boards yet. Create one to get started.
          </div>
        </div>
      )}
    </div>
  );
}
