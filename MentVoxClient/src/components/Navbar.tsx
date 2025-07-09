import { Link } from "react-router-dom";
import "./Navbar.css"; // אם תרצי לעצב את הניווט

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/upload">Upload</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
