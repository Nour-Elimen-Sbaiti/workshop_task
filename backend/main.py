import sqlite3
from pathlib import Path
from contextlib import closing
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB = Path(__file__).with_name("students.db")


def connect():
    db = sqlite3.connect(DB)
    db.row_factory = sqlite3.Row
    return db


with closing(connect()) as db:
    db.execute("""CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, email TEXT NOT NULL,
        age INTEGER NOT NULL)""")
    db.commit()


class StudentInput(BaseModel):
    name: str = Field(min_length=1)
    email: str = Field(min_length=3)
    age: int = Field(ge=1, le=120)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Student API is running"}


@app.get("/students")
def list_students():
    with closing(connect()) as db:
        rows = db.execute("SELECT * FROM students").fetchall()
    return [dict(row) for row in rows]


@app.post("/students", status_code=201)
def add_student(student: StudentInput):
    with closing(connect()) as db:
        cur = db.execute(
            "INSERT INTO students (name, email, age) VALUES (?, ?, ?)",
            (student.name, student.email, student.age),
        )
        db.commit()
    return {"id": cur.lastrowid, **student.model_dump()}


@app.put("/students/{student_id}")
def update_student(student_id: int, student: StudentInput):
    with closing(connect()) as db:
        cur = db.execute(
            "UPDATE students SET name=?, email=?, age=? WHERE id=?",
            (student.name, student.email, student.age, student_id),
        )
        db.commit()
        if not cur.rowcount:
            raise HTTPException(404, "Student not found")
    return {"id": student_id, **student.model_dump()}


@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    with closing(connect()) as db:
        cur = db.execute("DELETE FROM students WHERE id=?", (student_id,))
        db.commit()
        if not cur.rowcount:
            raise HTTPException(404, "Student not found")
    return {"message": "Student deleted"}