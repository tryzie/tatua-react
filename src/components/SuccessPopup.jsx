const SuccessPopup = ({ onClose }) => {
    return (
        <div id="success-popup" className="popup">
            <div className="popup-content success-popup">
                <h3>Success!</h3>
                <p>Your ticket has been submitted successfully.</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default SuccessPopup;