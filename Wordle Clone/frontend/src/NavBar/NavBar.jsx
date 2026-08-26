import './NavBar.css';

export default function NavBar({ logoutUser, openHowToPlay, openStats, isCS, onModeToggle }) {
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
            <button className="nav-button" type="button" onClick={openHowToPlay}>
                How to Play
            </button>
            <button className="nav-button" type="button" onClick={openStats}>
                Stats
            </button>
            <button
                className={`nav-button mode-toggle ${isCS ? 'mode-toggle--active' : ''}`}
                type="button"
                role="switch"
                aria-checked={isCS}
                onClick={onModeToggle}
            >
                {isCS ? 'CS Words' : 'Normal Words'}
            </button>
        </div>
    );
}