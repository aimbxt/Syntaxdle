import './NavBar.css';

export default function NavBar() {
    return (
        <div className="navbar">
            <button className="nav-button" type="button">
                Logout
            </button>
            <button className="nav-button" type="button">
                How to Play
            </button>
            <button className="nav-button" type="button">
                Stats
            </button>
        </div>
    );
}