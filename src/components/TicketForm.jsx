import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const TicketForm = ({ onSubmitSuccess }) => {
    const [formData, setFormData] = useState(() => {
        // Load form data from localStorage on mount
        const savedFormData = loadFromLocalStorage('formData');
        return savedFormData || {
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            contactMethod: 'email',
            attachment: null,
            terms: false,
        };
    });

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        saveToLocalStorage('formData', formData);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
        }));
    };

    const validateForm = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^(254|\+254)[0-9]{9}$|(07|01)[0-9]{8}$/;
        const requiredFields = { ...formData, attachment: true }
        if (Object.values(requiredFields).some((val) => !val && val !== null)) {
            alert('All fields are required.');
            return false;
        }
        if (!emailPattern.test(formData.email)) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (!phonePattern.test(formData.phone)) {
            alert('Please enter a valid phone number.');
            return false;
        }
        if (!formData.terms) {
            alert('You must agree to the Terms and Conditions.');
            return false;
        }
        return true;
    };

    const formatPhoneNumber = (number) => {
        if (/^(07|01)[0-9]{8}$/.test(number)) return '+254' + number.slice(1);
        if (/^254[0-9]{9}$/.test(number)) return '+' + number;
        if (/^\+254[0-9]{9}$/.test(number)) return number;
        return null;
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formattedPhone = formatPhoneNumber(formData.phone);
        if (!formattedPhone) {
            alert('Invalid phone number format.');
            return;
        }

        const submissions = loadFromLocalStorage('submissions') || [];
        const newEntry = {
            ticketId: submissions.length + 1,
            fullName: formData.fullName,
            email: formData.email,
            phone: formattedPhone,
            subject: formData.subject,
            message: formData.message,
            contactMethod: formData.contactMethod,
            dateCreated: new Date().toISOString().split('T')[0],
            attachment: formData.attachment ? await convertFileToBase64(formData.attachment) : null,
        };

        submissions.push(newEntry);
        saveToLocalStorage('submissions', submissions);

        // Reset the form and clear the saved form data
        const initialFormData = {
            fullName: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
            contactMethod: 'email',
            attachment: null,
            terms: false,
        };
        setFormData(initialFormData);
        saveToLocalStorage('formData', initialFormData); // Clear saved form data
        e.target.reset();
        onSubmitSuccess();
    };

    return (
        <div id="form-container">
            <p>Have any enquiries? Fill this form and, we'll get back to you as soon as possible.</p>
            <form id="ticket-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="full-name">Full Name:</label>
                    <input
                        type="text"
                        id="full-name"
                        name="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="someone@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="0712345678"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject:</label>
                    <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a subject</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing</option>
                        <option value="general">General Inquiry</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="radio-group">
                    <label>Preferred Contact:</label>
                    <label>
                        <input
                            type="radio"
                            name="contactMethod"
                            value="email"
                            checked={formData.contactMethod === 'email'}
                            onChange={handleChange}
                        />{' '}
                        Email
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contactMethod"
                            value="phone"
                            checked={formData.contactMethod === 'phone'}
                            onChange={handleChange}
                        />{' '}
                        Phone
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="attachment">Attachment:</label>
                    <input
                        type="file"
                        id="attachment"
                        name="attachment"
                        accept=".pdf, .jpg, .png"
                        onChange={handleChange}
                    />
                </div>
                <div className="checkbox">
                    <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="terms">
                        I agree to the <a href="#">Terms and Conditions</a>
                    </label>
                </div>
                <button type="submit" className="submit-btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default TicketForm;