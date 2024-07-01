import React from "react"
import { useState, useEffect } from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import {nanoid} from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase.jsx"

export default function App() {
  const [notes, setNotes] = useState([])

  useEffect(()=>{
    const detach = onSnapshot(notesCollection, function(snapshot){
        const notesArray = snapshot.docs.map(doc =>({
            ...doc.data(),
            id: doc.id
        }))
        setNotes(notesArray)
    })

    return detach
  },[])

  const [currentNoteId, setCurrentNoteId] = useState("")
  const [tempNote, setTempNote] = useState("")

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

  useEffect(() => {
    if (!currentNoteId) {
        setCurrentNoteId(notes[0]?.id)
    }
   }, [notes])

  const currentNote = notes.find(note => {
    return note.id === currentNoteId
  }) || notes[0]
  
   useEffect(() => {
    if (currentNote) {
        setTempNote(currentNote.body)
    }
   }, [currentNote])

   useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNote !== currentNote.body) {
                updateNote(tempNote)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNote])

  async function createNewNote() {
      const newNote = {
          body: "# Type your markdown note's title here",
          createdAt: Date.now(),
          updatedAt: Date.now()
      }
      const newNoteRef = await addDoc(notesCollection, newNote)
      setCurrentNoteId(newNoteRef.id)
  }
  
  async function updateNote(text) {
    // setNotes(oldNotes => {
    //     const arr = []
    //     for(var i=0;i<oldNotes.length;i++){
    //         const oldNote = oldNotes[i];
    //         if(oldNote.id === currentNoteId){
    //             arr.unshift({...oldNote, body: text})
    //         }
    //         else{
    //             arr.push(oldNote)
    //         }
    //     }
    //     return arr
    // })

    const docRef = doc(db, "notes", currentNoteId)
    await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
  }
  
  
  async function deleteNote(noteId){
    // var ind = -1;
    // for(var i=0;i<notes.length;i++){
    //     if(noteId===notes[i].id){
    //         ind=i;
    //         break;
    //         }
    // }
    // if(ind>-1){
    //     notes.splice(ind,1)
    // }
    
    // setNotes(notes)

    const docRef = doc(db, "notes", noteId)
    await deleteDoc(docRef)

  }

  return (
      <main>
      {
          notes.length > 0 
          ?
          <Split 
              sizes={[30, 70]} 
              direction="horizontal" 
              className="split"
          >
              <Sidebar
                  notes={sortedNotes}
                  currentNote={currentNote}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
              
                  <Editor 
                      tempNote={tempNote} 
                      setTempNote={setTempNote} 
                  />
              
          </Split>
          :
          <div className="no-notes">
              <h1>You have no notes</h1>
              <button 
                  className="first-note" 
                  onClick={createNewNote}
              >
                  Create one now
              </button>
          </div>
          
      }
      </main>
  )
}