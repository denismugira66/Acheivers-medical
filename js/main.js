/**
 * Achievers Medical Consultance
 * Complete JavaScript Functionality
 * Features: Mobile Navigation, Form Handling, Appointment Management,
 *           Health Tips Carousel, Dark Mode, Patient Dashboard Logic,
 *           WhatsApp Integration, Service Filtering, and more
 */

// ============================================
// 1. DOM Ready Event Listener
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all modules
    initMobileNavigation();
    initAppointmentForm();
    initContactForm();
    initNewsletterSignup();
    initHealthTipsCarousel();
    initServiceFiltering();
    initTestimonialSlider();
    initDashboardFeatures();
    initDarkMode();
    initScrollAnimations();
    initBackToTopButton();
    initLiveClock();
    initAppointmentReminders();
    initPatientSearch();
    initPrescriptionRenewal();
    initVitalSignsTracker();
    initWhatsAppQuickActions();
    initBookingCalendar();
    initFloatingActionButtons();
    initCookieConsent();
    initFormValidation();
    initFooterYear();
    
    // Load saved preferences
    loadUserPreferences();
});

function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ============================================
// 2. Mobile Navigation Toggle
// ============================================
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

// ============================================
// 3. Appointment Form with Local Storage
// ============================================
function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        // Load saved form data if exists
        const savedData = localStorage.getItem('appointmentDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            for (let key in data) {
                const field = appointmentForm.querySelector(`[name="${key}"]`);
                if (field) field.value = data[key];
            }
            showNotification('We saved your draft appointment!', 'info');
        }
        
        // Auto-save form data
        const formInputs = appointmentForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const formData = {};
                formInputs.forEach(field => {
                    if (field.name) {
                        formData[field.name] = field.value;
                    }
                });
                localStorage.setItem('appointmentDraft', JSON.stringify(formData));
            });
        });
        
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(appointmentForm);
            const appointment = {
                id: Date.now(),
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                date: formData.get('date'),
                service: formData.get('service'),
                time: formData.get('time'),
                notes: formData.get('notes'),
                status: 'pending',
                timestamp: new Date().toISOString()
            };
            
            let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
            appointments.push(appointment);
            localStorage.setItem('appointments', JSON.stringify(appointments));
            
            localStorage.removeItem('appointmentDraft');
            
            const successDiv = document.getElementById('formSuccess');
            if (successDiv) {
                successDiv.style.display = 'block';
                appointmentForm.reset();
                
                // Send WhatsApp confirmation
                sendWhatsAppConfirmation(appointment);
                
                setTimeout(() => {
                    successDiv.style.display = 'none';
                }, 5000);
            }
            
            // Trigger confetti effect
            triggerConfetti();
            
            // Update dashboard if on dashboard page
            updateDashboardAppointments();
        });
    }
}

// ============================================
// 4. Contact Form Submission
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName')?.value;
            const email = document.getElementById('contactEmail')?.value;
            const message = document.getElementById('contactMessage')?.value;
            
            // Save inquiry
            let inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
            inquiries.push({
                id: Date.now(),
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            });
            localStorage.setItem('inquiries', JSON.stringify(inquiries));
            
            showNotification('Message sent successfully! We will respond within 24 hours.', 'success');
            contactForm.reset();
        });
    }
}

// ============================================
// 5. Newsletter Signup
// ============================================
function initNewsletterSignup() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]')?.value;
            if (email) {
                let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                    showNotification('Thanks for subscribing! Check your email for health tips.', 'success');
                } else {
                    showNotification('You are already subscribed!', 'info');
                }
                this.reset();
            }
        });
    }
}

// ============================================
// 6. Health Tips Carousel
// ============================================
function initHealthTipsCarousel() {
    const tips = [
        { icon: '💧', text: 'Drink at least 8 glasses of water daily for optimal hydration.' },
        { icon: '🏃', text: 'Aim for 30 minutes of physical activity, 5 days a week.' },
        { icon: '😴', text: 'Adults need 7-9 hours of quality sleep each night.' },
        { icon: '🥗', text: 'Include fruits and vegetables in every meal.' },
        { icon: '🩺', text: 'Schedule regular checkups even when feeling healthy.' },
        { icon: '💊', text: 'Take medications exactly as prescribed by your doctor.' },
        { icon: '🧘', text: 'Practice stress management through deep breathing or meditation.' },
        { icon: '🩸', text: 'Monitor your blood pressure regularly if you have hypertension.' }
    ];
    
    let currentTip = 0;
    const tipElement = document.getElementById('healthTip');
    
    if (tipElement) {
        function rotateTip() {
            currentTip = (currentTip + 1) % tips.length;
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.innerHTML = `${tips[currentTip].icon} ${tips[currentTip].text}`;
                tipElement.style.opacity = '1';
            }, 300);
        }
        
        setInterval(rotateTip, 8000);
    }
}

// ============================================
// 7. Service Filtering
// ============================================
function initServiceFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter services
                serviceCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}

// ============================================
// 8. Testimonial Slider
// ============================================
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card-full');
    let currentTestimonial = 0;
    
    if (testimonials.length > 0 && window.innerWidth < 768) {
        const prevBtn = document.getElementById('prevTestimonial');
        const nextBtn = document.getElementById('nextTestimonial');
        
        function showTestimonial(index) {
            testimonials.forEach((t, i) => {
                t.style.display = i === index ? 'block' : 'none';
            });
        }
        
        if (prevBtn && nextBtn) {
            showTestimonial(0);
            prevBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
            nextBtn.addEventListener('click', () => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            });
        }
    }
}

// ============================================
// 9. Dashboard Features
// ============================================
function initDashboardFeatures() {
    // Load appointments
    updateDashboardAppointments();
    
    // Load medical records
    loadMedicalRecords();
    
    // Handle medication reminders toggle
    const reminderToggle = document.getElementById('reminderToggle');
    if (reminderToggle) {
        const reminderStatus = localStorage.getItem('whatsappReminders') === 'enabled';
        reminderToggle.checked = reminderStatus;
        
        reminderToggle.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem('whatsappReminders', 'enabled');
                showNotification('WhatsApp reminders enabled!', 'success');
                requestNotificationPermission();
            } else {
                localStorage.setItem('whatsappReminders', 'disabled');
                showNotification('WhatsApp reminders disabled', 'info');
            }
        });
    }
    
    // Handle prescription renewal
    const renewButtons = document.querySelectorAll('.renew-prescription');
    renewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const medication = this.dataset.medication;
            requestPrescriptionRenewal(medication);
        });
    });
}

function updateDashboardAppointments() {
    const appointmentsList = document.getElementById('upcomingAppointments');
    if (appointmentsList) {
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const upcoming = appointments.filter(a => new Date(a.date) >= new Date()).slice(0, 3);
        
        if (upcoming.length > 0) {
            appointmentsList.innerHTML = upcoming.map(apt => `
                <div class="appointment-item">
                    <div class="appointment-date">
                        <span class="date-day">${new Date(apt.date).getDate()}</span>
                        <span class="date-month">${new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div class="appointment-details">
                        <strong>${apt.service || 'Consultation'}</strong>
                        <p>${apt.time || 'Flexible'} | ${apt.name}</p>
                    </div>
                    <button class="btn-small" onclick="cancelAppointment(${apt.id})">Cancel</button>
                </div>
            `).join('');
        } else {
            appointmentsList.innerHTML = '<p>No upcoming appointments. <a href="contact.html">Book one now →</a></p>';
        }
    }
}

function loadMedicalRecords() {
    const recordsList = document.getElementById('medicalRecords');
    if (recordsList) {
        // Simulated medical records
        const records = [
            { name: 'Blood Test Results', date: '2024-03-15', type: 'pdf' },
            { name: 'Annual Physical Report', date: '2024-02-28', type: 'pdf' },
            { name: 'Prescription History', date: '2024-03-01', type: 'pdf' }
        ];
        
        recordsList.innerHTML = records.map(record => `
            <div class="record-item">
                <span><i class="fas fa-file-${record.type}"></i> ${record.name}</span>
                <small>${record.date}</small>
                <a href="#" class="download-record" data-file="${record.name}">Download</a>
            </div>
        `).join('');
        
        // Add download handlers
        document.querySelectorAll('.download-record').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Download started. Check your downloads folder.', 'success');
            });
        });
    }
}

// ============================================
// 10. Dark Mode Toggle
// ============================================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'enabled');
                showNotification('Dark mode enabled for comfortable viewing', 'info');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// Add dark mode styles dynamically
const darkModeStyles = `
    body.dark-mode {
        background-color: #1a1a2e;
        color: #e0e0e0;
    }
    body.dark-mode .navbar,
    body.dark-mode .service-card,
    body.dark-mode .why-card,
    body.dark-mode .dashboard-card,
    body.dark-mode .testimonial-card-full,
    body.dark-mode .pricing-card {
        background-color: #16213e;
        border-color: #0f3460;
    }
    body.dark-mode .contact-method,
    body.dark-mode .appointment-form-large {
        background-color: #16213e;
    }
    body.dark-mode .hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
    body.dark-mode .section-title {
        color: #e0e0e0;
    }
    body.dark-mode .btn-outline {
        border-color: #e0e0e0;
        color: #e0e0e0;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = darkModeStyles;
document.head.appendChild(styleSheet);

// ============================================
// 11. Scroll Animations
// ============================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .why-card, .team-card, .testimonial-card-full');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// 12. Back to Top Button
// ============================================
function initBackToTopButton() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ============================================
// 13. Live Clock (for dashboard)
// ============================================
function initLiveClock() {
    const clockElement = document.getElementById('liveClock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            clockElement.textContent = now.toLocaleDateString('en-US', options);
        }
        updateClock();
        setInterval(updateClock, 60000);
    }
}

// ============================================
// 14. Appointment Reminders
// ============================================
function initAppointmentReminders() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const now = new Date();
    
    appointments.forEach(apt => {
        const aptDate = new Date(apt.date);
        const diffHours = (aptDate - now) / (1000 * 60 * 60);
        
        // Remind 24 hours before
        if (diffHours > 0 && diffHours <= 24 && !apt.reminded) {
            showNotification(`Reminder: You have an appointment tomorrow at ${apt.time}`, 'info');
            apt.reminded = true;
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    });
}

// ============================================
// 15. Patient Search (Admin Feature)
// ============================================
function initPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const patients = JSON.parse(localStorage.getItem('appointments') || '[]');
            const filtered = patients.filter(p => 
                p.name?.toLowerCase().includes(searchTerm) || 
                p.phone?.includes(searchTerm)
            );
            displayPatientResults(filtered);
        });
    }
}

function displayPatientResults(patients) {
    const resultsDiv = document.getElementById('patientResults');
    if (resultsDiv) {
        if (patients.length > 0) {
            resultsDiv.innerHTML = patients.map(p => `
                <div class="patient-card">
                    <h4>${p.name}</h4>
                    <p>📞 ${p.phone}</p>
                    <p>📅 Last visit: ${p.date || 'N/A'}</p>
                    <button onclick="viewPatientDetails('${p.id}')">View Details</button>
                </div>
            `).join('');
        } else {
            resultsDiv.innerHTML = '<p>No patients found.</p>';
        }
    }
}

// ============================================
// 16. Prescription Renewal Request
// ============================================
function initPrescriptionRenewal() {
    const renewalForm = document.getElementById('prescriptionRenewal');
    if (renewalForm) {
        renewalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const medication = document.getElementById('medicationName')?.value;
            const dosage = document.getElementById('dosage')?.value;
            
            let renewals = JSON.parse(localStorage.getItem('prescriptionRenewals') || '[]');
            renewals.push({
                id: Date.now(),
                medication: medication,
                dosage: dosage,
                date: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('prescriptionRenewals', JSON.stringify(renewals));
            
            showNotification('Renewal request submitted! We will contact you within 24 hours.', 'success');
            renewalForm.reset();
            
            // Send WhatsApp notification
            sendWhatsAppMessage(`Prescription renewal requested for ${medication}`);
        });
    }
}

function requestPrescriptionRenewal(medication) {
    showNotification(`Renewal request for ${medication} submitted!`, 'success');
    sendWhatsAppMessage(`Please renew my prescription for ${medication}`);
}

// ============================================
// 17. Vital Signs Tracker
// ============================================
function initVitalSignsTracker() {
    const vitalForm = document.getElementById('vitalSignsForm');
    if (vitalForm) {
        // Load saved vitals
        loadVitalHistory();
        
        vitalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const vitals = {
                date: new Date().toISOString(),
                bloodPressure: document.getElementById('bp')?.value,
                heartRate: document.getElementById('heartRate')?.value,
                weight: document.getElementById('weight')?.value,
                bloodSugar: document.getElementById('bloodSugar')?.value
            };
            
            let vitalHistory = JSON.parse(localStorage.getItem('vitalHistory') || '[]');
            vitalHistory.push(vitals);
            localStorage.setItem('vitalHistory', JSON.stringify(vitalHistory));
            
            showNotification('Vital signs saved successfully!', 'success');
            loadVitalHistory();
            vitalForm.reset();
        });
    }
}

function loadVitalHistory() {
    const historyDiv = document.getElementById('vitalHistory');
    if (historyDiv) {
        const vitalHistory = JSON.parse(localStorage.getItem('vitalHistory') || '[]');
        const recent = vitalHistory.slice(-5).reverse();
        
        if (recent.length > 0) {
            historyDiv.innerHTML = recent.map(v => `
                <div class="vital-entry">
                    <strong>${new Date(v.date).toLocaleDateString()}</strong>
                    <span>BP: ${v.bloodPressure || 'N/A'}</span>
                    <span>HR: ${v.heartRate || 'N/A'}</span>
                    <span>Weight: ${v.weight || 'N/A'} kg</span>
                </div>
            `).join('');
        } else {
            historyDiv.innerHTML = '<p>No vital signs recorded yet.</p>';
        }
    }
}

// ============================================
// 18. WhatsApp Quick Actions
// ============================================
function initWhatsAppQuickActions() {
    const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const message = this.dataset.whatsapp || 'Hello Achievers Medical, I need assistance.';
            sendWhatsAppMessage(message);
        });
    });
}

function sendWhatsAppMessage(message) {
    const phoneNumber = '256700123456';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

function sendWhatsAppConfirmation(appointment) {
    const message = `Hello! I have scheduled an appointment with Achievers Medical on ${appointment.date} at ${appointment.time} for ${appointment.service}. Please confirm.`;
    // In production, this would send automatically via API
    console.log('WhatsApp confirmation would send:', message);
}

// ============================================
// 19. Booking Calendar (Simple)
// ============================================
function initBookingCalendar() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Disable weekends (optional)
        dateInput.addEventListener('change', function() {
            const selected = new Date(this.value);
            const day = selected.getDay();
            if (day === 0 || day === 6) {
                showNotification('Please select a weekday (Monday-Friday) for appointments.', 'warning');
                this.value = '';
            }
        });
    }
}

// ============================================
// 20. Floating Action Buttons
// ============================================
function initFloatingActionButtons() {
    const fab = document.getElementById('fabMenu');
    if (fab) {
        fab.addEventListener('click', function() {
            this.classList.toggle('open');
        });
    }
}

// ============================================
// 21. Cookie Consent Banner
// ============================================
function initCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        const banner = document.createElement('div');
        banner.id = 'cookieConsent';
        banner.innerHTML = `
            <div class="cookie-banner">
                <p>We use cookies to improve your experience. By using our site, you agree to our cookie policy.</p>
                <button onclick="acceptCookies()">Accept</button>
                <button onclick="declineCookies()">Decline</button>
            </div>
        `;
        document.body.appendChild(banner);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: var(--navy);
                color: white;
                padding: 16px;
                border-radius: 12px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                align-items: center;
                gap: 16px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .cookie-banner button {
                padding: 8px 20px;
                border: none;
                border-radius: 30px;
                cursor: pointer;
                font-weight: 600;
            }
            .cookie-banner button:first-of-type {
                background: var(--green);
                color: white;
            }
            .cookie-banner button:last-of-type {
                background: transparent;
                border: 1px solid white;
                color: white;
            }
            @media (max-width: 768px) {
                .cookie-banner {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

window.acceptCookies = function() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieConsent')?.remove();
    showNotification('Thank you for accepting cookies!', 'success');
};

window.declineCookies = function() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieConsent')?.remove();
};

// ============================================
// 22. Form Validation
// ============================================
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showNotification(`Please fill in ${field.placeholder || field.name}`, 'error');
                } else {
                    field.classList.remove('error');
                }
                
                // Email validation
                if (field.type === 'email' && field.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        showNotification('Please enter a valid email address', 'error');
                    }
                }
                
                // Phone validation (East African format)
                if (field.type === 'tel' && field.value) {
                    const phoneRegex = /^(?:\+256|0)[0-9]{9}$|^(?:\+254|0)[0-9]{9}$/;
                    if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                        isValid = false;
                        field.classList.add('error');
                        showNotification('Please enter a valid Ugandan or Kenyan phone number', 'error');
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Remove error on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    });
}

// ============================================
// 23. Notification System
// ============================================
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${getNotificationIcon(type)}</span>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    notification.style.cssText = `
        background: ${type === 'success' ? '#2C7A4B' : type === 'error' ? '#DC2626' : type === 'warning' ? '#F59E0B' : '#3B82F6'};
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        font-size: 0.9rem;
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ============================================
// 24. Confetti Effect (for celebrations)
// ============================================
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        // Simple fallback
        console.log('🎉 Appointment booked! 🎉');
    }
}

// ============================================
// 25. Request Notification Permission
// ============================================
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Notifications enabled! You will receive appointment reminders.', 'success');
            }
        });
    }
}

// ============================================
// 26. Load User Preferences
// ============================================
function loadUserPreferences() {
    // Load language preference
    const language = localStorage.getItem('preferredLanguage') || 'en';
    if (language !== 'en') {
        // In production, load translations
        console.log(`Loading ${language} translations`);
    }
    
    // Load font size preference
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
        document.body.style.fontSize = fontSize;
    }
}

// ============================================
// 27. Global Functions (accessible from HTML)
// ============================================
window.cancelAppointment = function(appointmentId) {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments = appointments.filter(a => a.id !== appointmentId);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    updateDashboardAppointments();
    showNotification('Appointment cancelled successfully', 'success');
};

window.viewPatientDetails = function(patientId) {
    const patients = JSON.parse(localStorage.getItem('appointments') || '[]');
    const patient = patients.find(p => p.id == patientId);
    if (patient) {
        showNotification(`Viewing details for ${patient.name}`, 'info');
        // In production, open modal with patient details
    }
};

window.setFontSize = function(size) {
    document.body.style.fontSize = size;
    localStorage.setItem('fontSize', size);
    showNotification(`Font size set to ${size}`, 'success');
};

window.exportHealthData = function() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const vitals = JSON.parse(localStorage.getItem('vitalHistory') || '[]');
    const data = { appointments, vitals, exportDate: new Date().toISOString() };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `achievers_health_data_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Health data exported successfully!', 'success');
};

// ============================================
// 28. Service Worker Registration (PWA)
// ============================================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
    }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
    });
}

// ============================================
// 29. Analytics Tracking (Simulated)
// ============================================
function trackEvent(category, action, label) {
    // In production, send to analytics service
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    
    // Store in localStorage for demo
    let events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
    events.push({
        category,
        action,
        label,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('analyticsEvents', JSON.stringify(events.slice(-100))); // Keep last 100
}

// Track page views
trackEvent('Page View', window.location.pathname, document.title);

// Track outbound links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
        trackEvent('Outbound Link', this.href, document.title);
    });
});