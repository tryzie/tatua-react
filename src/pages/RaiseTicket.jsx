import { useState } from 'react';
import TicketForm from '../components/TicketForm';
import SuccessPopup from '../components/SuccessPopup';

const RaiseTicket = () => {
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmitSuccess = () => {
        setShowSuccess(true);
    };

    return (
        <>
            <TicketForm onSubmitSuccess={handleSubmitSuccess} />
            {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
        </>
    );
};

export default RaiseTicket;