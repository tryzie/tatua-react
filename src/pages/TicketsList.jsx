import { useState, useEffect } from 'react';
import DynamicTable from '../components/DynamicTable';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const TicketsList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [editEntry, setEditEntry] = useState(null);

    useEffect(() => {
        const storedSubmissions = loadFromLocalStorage('submissions') || [];
        setSubmissions(storedSubmissions);
    }, []);

    const handleShowInfo = (index) => {
        setSelectedEntry(submissions[index]);
        setShowModal(true);
    };

    const handleDownload = (index) => {
        const entry = submissions[index];
        if (entry.attachment) {
            const a = document.createElement('a');
            a.href = entry.attachment;
            a.download = `Ticket-${entry.ticketId}-attachment`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('No attachment available.');
        }
    };

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    const handleEmail = (email) => {
        window.location.href = `mailto:${email}`;
    };

    const handleEdit = (index) => {
        setEditEntry({ ...submissions[index], index });
    };

    const handleDelete = (index) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            const newSubmissions = [...submissions];
            newSubmissions.splice(index, 1);
            setSubmissions(newSubmissions);
            saveToLocalStorage('submissions', newSubmissions);
        }
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedEntry = {
            ...editEntry,
            fullName: formData.get('fullName').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            subject: formData.get('subject'),
            message: formData.get('message').trim(),
        };
        const newSubmissions = [...submissions];
        newSubmissions[editEntry.index] = updatedEntry;
        setSubmissions(newSubmissions);
        saveToLocalStorage('submissions', newSubmissions);
        setEditEntry(null);
    };

    const columns = [
        { header: 'Ticket ID', accessor: 'ticketId', type: 'number' },
        { header: 'Raised by', accessor: 'raisedBy', type: 'string' },
        { header: 'Ticket Details', accessor: 'ticketDetails', type: 'string' },
        { header: 'Date Created', accessor: 'dateCreated', type: 'date' },
        {
            header: 'Actions',
            accessor: 'actions',
            actions: {
                showInfo: { enabled: true, handler: handleShowInfo },
                download: { enabled: true, handler: handleDownload },
                call: { enabled: true, handler: (row) => handleCall(row.phone) },
                email: { enabled: true, handler: (row) => handleEmail(row.email) },
                edit: { enabled: true, handler: handleEdit },
                delete: { enabled: true, handler: handleDelete }
            }
        },
    ];

    return (
        <div id="table-container">
            <DynamicTable
                initialData={submissions}
                columns={columns}
                pageSizeOptions={[3, 5, 10]}
                showSortPopup={true}
                showFilterPopup={true}
                showPagination={true}
            />

            {showModal && selectedEntry && (
                <div className="modal-container">
                    <div className="modal">
                        <h2>Ticket #{selectedEntry.ticketId}</h2>
                        <p>
                            <strong>Name:</strong> {selectedEntry.fullName}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedEntry.email}
                        </p>
                        <p>
                            <strong>Phone:</strong> {selectedEntry.phone}
                        </p>
                        <p>
                            <strong>Subject:</strong> {selectedEntry.subject}
                        </p>
                        <p>
                            <strong>Message:</strong> {selectedEntry.message}
                        </p>
                        <p>
                            <strong>Attachment:</strong>
                        </p>
                        {selectedEntry.attachment ? (
                            selectedEntry.attachment.includes('pdf') ? (
                                <embed
                                    src={selectedEntry.attachment}
                                    width="100%"
                                    height="400px"
                                    type="application/pdf"
                                />
                            ) : (
                                <img
                                    src={selectedEntry.attachment}
                                    alt="Attachment"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            )
                        ) : (
                            <p>No attachment uploaded.</p>
                        )}
                        <br />
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}

            {editEntry && (
                <div className="modal-container">
                    <div className="modal">
                        <h2>Edit Ticket #{editEntry.ticketId}</h2>
                        <form id="edit-form" onSubmit={handleSaveEdit}>
                            <div className="form-group">
                                <label htmlFor="edit-fullName">Full Name:</label>
                                <input
                                    type="text"
                                    id="edit-fullName"
                                    name="fullName"
                                    defaultValue={editEntry.fullName}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-email">Email:</label>
                                <input
                                    type="email"
                                    id="edit-email"
                                    name="email"
                                    defaultValue={editEntry.email}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-phone">Phone:</label>
                                <input
                                    type="tel"
                                    id="edit-phone"
                                    name="phone"
                                    defaultValue={editEntry.phone}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-subject">Subject:</label>
                                <select id="edit-subject" name="subject" defaultValue={editEntry.subject} required>
                                    <option value="technical">Technical Issue</option>
                                    <option value="billing">Billing</option>
                                    <option value="general">General Inquiry</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-message">Message:</label>
                                <textarea
                                    id="edit-message"
                                    name="message"
                                    rows="4"
                                    defaultValue={editEntry.message}
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditEntry(null)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketsList;