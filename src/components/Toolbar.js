import { useState } from "react";
import "./Toolbar.css";

export default function Toolbar({ setShowMathGame, setShowEnglishLesson }) {
  const [isOpen, setIsOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);

  return (
    <nav className="toolbar">
      <div className="toolbar-container">
        <div className="logo">Štúdium</div>

        <div className="menu">
          <NavItem icon="🏠" text="Domov" />
          <div className="submenu-container">
            <NavItem icon="📖" text="Štúdium" onClick={() => setStudyOpen(!studyOpen)}>
              <span className="dropdown-icon">▼</span>
            </NavItem>
            <div className={`submenu ${studyOpen ? "submenu-open" : "submenu-closed"}`}>
              <NavItem text="Matematika" mobile onClick={() => {
                setShowMathGame(true);
                setShowEnglishLesson(false);
              }} />
              <NavItem text="Slovná zásoba" mobile onClick={() => {
                setShowMathGame(false);
                setShowEnglishLesson(true);
              }} />
            </div>
          </div>
          <NavItem icon="📊" text="Štatistiky" />
          <NavItem icon="👤" text="Profil" />
        </div>

        <div className="mobile-menu-button" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </div>
      </div>

      <div className={`mobile-menu ${isOpen ? "mobile-menu-open" : "mobile-menu-closed"}`}>
        <NavItem icon="🏠" text="Domov" mobile />
        <div>
          <NavItem icon="📖" text="Štúdium" mobile onClick={() => setStudyOpen(!studyOpen)}>
            <span className="dropdown-icon">▼</span>
          </NavItem>
          <div className={`submenu ${studyOpen ? "submenu-open" : "submenu-closed"}`}>
            <NavItem text="Matematika" mobile onClick={() => {
              setShowMathGame(true);
              setShowEnglishLesson(false);
            }} />
            <NavItem text="Slovná zásoba" mobile onClick={() => {
              setShowMathGame(false);
              setShowEnglishLesson(true);
            }} />
          </div>
        </div>
        <NavItem icon="📊" text="Štatistiky" mobile />
        <NavItem icon="👤" text="Profil" mobile />
      </div>
    </nav>
  );
}

function NavItem({ icon, text, mobile, onClick, children }) {
  return (
    <div className={`nav-item ${mobile ? "nav-item-mobile" : "nav-item-desktop"}`} onClick={onClick}>
      {icon && <span className="icon">{icon}</span>} <span>{text}</span> {children}
    </div>
  );
}