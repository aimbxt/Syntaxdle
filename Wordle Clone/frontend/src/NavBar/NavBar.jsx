import './NavBar.css';

export default function NavBar({ logoutUser }) {
    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="navbar">
            <button className="nav-button" type="button" onClick={handleLogout}>
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