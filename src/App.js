import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", descriptions: "" });

  // popup state
  const [openPopup, setOpenPopup] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, title: "", descriptions: "" });

  // Load notes
  useEffect(() => {
    axios.get("https://four2works-api-2.onrender.com/api/notes")
      .then(res => {
        setNotes(res.data.data);
      })
      .catch(err => console.log(err));
  }, []);

  // Add Note
  const submitHandler = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!form.descriptions.trim()) {
      alert("Description is required");
      return;
    }

    try {
      await axios.post("https://four2works-api-2.onrender.com/api/notes", form);
      window.location.reload();
    } catch (error) {
      alert("Error adding note");
    }
  };


  // Delete Note
  const handleDelete = async (id) => {
    await axios.delete(`https://four2works-api-2.onrender.com/api/notes/${id}`);
    setNotes(notes.filter(n => n.id !== id));
  };

  // Open Edit Popup
  const openEditPopup = (note) => {
    setEditForm(note);
    setOpenPopup(true);
  };

  // Save Edited Note
  const handleUpdate = async () => {
    if (!editForm.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!editForm.descriptions.trim()) {
      alert("Description is required");
      return;
    }

    try {
      await axios.put(`https://four2works-api-2.onrender.com/api/notes/${editForm.id}`,
        editForm
      );

      setNotes(notes.map(n => n.id === editForm.id ? editForm : n));
      setOpenPopup(false);
    } catch (error) {
      alert("Error updating note");
    }
  };


  return (
    <div style={{ padding: "30px" }}>
      <h1>Note CRUD</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Descriptions"
        value={form.descriptions}
        onChange={(e) => setForm({ ...form, descriptions: e.target.value })}
      />
      <button onClick={submitHandler}>Add User 42Works</button>

      <h2>Note List 42Works</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Id</th>
            <th>Descriptions</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(notes) && notes.map(note => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.descriptions}</td>
              <td>{note.title}</td>

              <td>
                <button onClick={() => handleDelete(note.id)}>Delete</button>

                <button onClick={() => openEditPopup(note)} style={{ marginLeft: 10 }}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* -------------------- Edit Popup -------------------- */}
      {openPopup && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <h2>Edit Note</h2>

            <input
              style={popupStyles.input}
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              placeholder="Title"
            />

            <input
              style={popupStyles.input}
              value={editForm.descriptions}
              onChange={(e) => setEditForm({ ...editForm, descriptions: e.target.value })}
              placeholder="Descriptions"
            />

            <div style={{ marginTop: 20 }}>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setOpenPopup(false)} style={{ marginLeft: 10 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

// Popup styles
const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  popup: {
    background: "#fff",
    padding: 20,
    width: 300,
    borderRadius: 8,
    boxShadow: "0 0 10px #000"
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10
  }
};
