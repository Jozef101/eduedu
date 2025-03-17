import React, { useState } from "react";
import "./SubjectComponent.css";

const subjects = [
  { name: "Math", icon: "📐" },
  { name: "English", icon: "📖" },
  { name: "Geography", icon: "🌍" },
  { name: "Science", icon: "🔬" },
];

const SubjectComponent = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="subject-container">
      {selectedSubject ? (
        <div className="subject-content">
          <button className="back-button" onClick={() => setSelectedSubject(null)}>⬅ Back</button>
          <h2>{selectedSubject.name} Study Area</h2>
          <p>Content for {selectedSubject.name} will go here.</p>
        </div>
      ) : (
        subjects.map((subject) => (
          <div 
            key={subject.name} 
            className="subject-card" 
            onClick={() => setSelectedSubject(subject)}
          >
            <span className="subject-icon">{subject.icon}</span>
            <span className="subject-name">{subject.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default SubjectComponent;
