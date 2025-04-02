import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RaiseTicket from './pages/RaiseTicket';
import TicketsList from './pages/TicketsList';
import './styles.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<RaiseTicket />} />
                <Route path="/tickets" element={<TicketsList />} />
            </Routes>
        </Router>
    );
};

export default App;