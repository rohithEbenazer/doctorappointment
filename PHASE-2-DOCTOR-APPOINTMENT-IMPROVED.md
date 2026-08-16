# PHASE 2 — DOCTOR CATALOG, SPECIALTIES & PATIENT APPOINTMENT BOOKING FOUNDATION

## 1. Project

**Hospital Doctor Appointment & Healthcare Platform**

Phase 2 builds the core patient and doctor care workflows on top of the Phase 1 identity & security foundation.

Phase 1 must be verified and marked **READY FOR PHASE 2** before implementation starts.

Phase 2 must make the application usable as a real hospital appointment booking system while keeping the codebase clean and extensible for later phases such as tele-consultation video links, medical records, e-prescriptions, billing/invoicing, and lab test integration.

---

# 2. Phase 2 Objective

Phase 2 establishes:

- Doctor directory & catalog
- Medical specialties / departments catalog
- Doctor CRUD & schedule management for authorized admins & doctors
- Doctor search by name, specialty, qualification, or symptoms
- Doctor filtering (specialty, consultation fee, experience, rating, availability)
- Doctor detailed profile (bio, qualifications, experience, clinic location, fees, slots)
- Doctor availability calendar & real-time slot generation
- Doctor profile photos & specialty icons
- Patient-facing Find Doctors page
- Patient-facing doctor cards & specialty cards
- Patient-facing doctor profile & appointment booking modal
- Home page hero section, featured specialties & top-rated doctors
- Admin doctor management & specialty management UI
- Doctor portal (today's schedule & patient queue)
- Patient portal (my appointments, cancellation, status tracking)
- Backend validation & JWT authorization
- Centralized API service integration
- Loading, empty, error, permission denied, and success notification states
- Responsive UI across mobile, tablet, and desktop
- Phase 2 testing and verification

Do **not** implement full online payment gateway processing or video calls in Phase 2.

The following belong to later phases:

- Online Payment Gateway (Razorpay/Stripe integration)
- Telehealth Video Consultation (WebRTC integration)
- E-Prescription & Pharmacy Delivery
- Medical Record Uploads & EHR Integration
- Lab Test Booking
- Rating & Review Submission Flow
- Advanced Hospital Analytics & Reporting
- SMS / WhatsApp Notifications

---

# 3. Phase 2 Dependency

```text
PHASE 1
Foundation
Authentication
Authorization
User Identity
React Router / API Routes
API Service Layer
Database Connection
Security Rules
UI Tokens & Design System
        |
        v
PHASE 2
Specialties / Departments
Doctor Directory
Doctor Profiles & Schedules
Doctor Search & Filtering
Slot Availability Engine
Patient Appointment Booking
Patient & Doctor Dashboards
Admin Management Portal
        |
        v
PHASE 3
Payment Gateway
Video Teleconsultation
E-Prescriptions
Medical Records
```

---

# 4. Roles Used in Phase 2

The application uses exactly these roles:

```text
SUPER_ADMIN
ADMIN
DOCTOR
PATIENT
```

## 4.1 Super Admin

Can:

- Create and manage hospital admins
- Manage specialties/departments
- Manage doctor directory and profile credentials
- View all system appointments & overall statistics
- Override appointment statuses if necessary
- Access all administrative & configuration features

## 4.2 Admin

Can:

- Create and update doctor profiles
- Manage medical specialties
- Update doctor availability & active status
- View system-wide appointments
- Manage hospital services & schedules

Admin must not:

- Create a Super Admin
- Delete a Super Admin
- Change a user's role to Super Admin

## 4.3 Doctor

Can:

- View assigned patient appointments
- Update appointment status (`CONFIRMED`, `COMPLETED`, `CANCELLED`)
- Add doctor notes to patient appointments
- Manage personal consultation availability hours
- View personal consultation history & earnings summary

Doctor must not:

- Access other doctors' private administration panels
- Modify system medical specialties
- Create or delete admin user accounts

## 4.4 Patient

Can:

- Browse Home page & Medical Specialties
- Search & filter doctors by specialty, fee, experience, and rating
- View doctor profiles & available time slots
- Book doctor appointments with date & slot selection
- View personal appointment history in Patient Portal
- Cancel upcoming pending/confirmed appointments

Patient cannot:

- Create, update, or delete doctor profiles
- Create or modify medical specialties
- Modify appointment statuses of other patients
- Access doctor or admin dashboard APIs

---

# 5. Doctor Model

Create a `Doctor` model.

Required fields:

```text
_id
userId
name
slug
specialtyId

qualification
experienceYears
consultationFee

bio
rating
reviewCount
avatar

clinicLocation
isAvailable
isActive

availability: [
  {
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "17:00",
    slotDurationMinutes: 30
  }
]

createdAt
updatedAt
```

---

# 6. Doctor Field Rules

## Name

- Required
- Trim whitespace
- Title prefixed (e.g., "Dr. Sarah Jenkins")
- Reasonable maximum length (100 chars)

## Slug

- Required
- URL-safe
- Unique
- Auto-generated from doctor name (e.g., `dr-sarah-jenkins`)

## Specialty ID

- Required
- Must reference a valid `Specialty` model

## Qualification & Experience

- Qualification required (e.g., "MD, FACC - Senior Cardiologist")
- Experience years must be a non-negative integer (e.g., 14)

## Consultation Fee

- Required
- Numeric value >= 0 (e.g., 500)
- Never trust fee amounts submitted directly by frontend on booking

## Bio & Avatar

- Bio optional, max 1000 chars
- Avatar image URL (centralized avatar generator fallback supported)

## Availability

- Array of weekly work shifts with time range and slot duration (default: 30 minutes)

---

# 7. Specialty Model

Create a `Specialty` model.

Fields:

```text
_id
name
slug
description
icon
isActive
createdAt
updatedAt
```

Example specialties:

```text
Cardiology
Dermatology
Neurology
Orthopedics
Pediatrics
General Medicine
Gynecology
Ophthalmology
```

Admins can create and manage specialties dynamically.

---

# 8. Specialty Rules

- Specialty name is required and unique.
- Slug must be unique.
- Inactive specialties must not appear in patient browse/filter dropdowns.
- Doctor profiles must reference a valid active specialty.
- Specialty deletion must require confirmation and prevent orphaned doctors.

---

# 9. Appointment Model & Statuses

Create an `Appointment` model.

Fields:

```text
_id
patientId
doctorId
specialtyId

appointmentDate (YYYY-MM-DD)
timeSlot (e.g., "10:30 AM")

status: PENDING | CONFIRMED | COMPLETED | CANCELLED
reason
patientNotes
doctorNotes

fee
paymentStatus: PENDING | PAID

createdAt
updatedAt
```

### Status Lifecycle:

```text
PATIENT BOOKING
       ↓
    PENDING
       ↓
    CONFIRMED  ──(Doctor completes consultation)──> COMPLETED
       ↓
   CANCELLED (by Patient or Doctor)
```

---

# 10. Doctor Directory API

Base URL: `/api/v1`

## Patient / Public APIs

```http
GET /api/v1/specialties
GET /api/v1/doctors
GET /api/v1/doctors/:id
GET /api/v1/doctors/slug/:slug
GET /api/v1/doctors/:id/available-slots?date=2026-08-15
POST /api/v1/appointments
GET /api/v1/appointments/my
PATCH /api/v1/appointments/:id/cancel
```

## Doctor APIs

```http
GET /api/v1/doctor/appointments
PATCH /api/v1/doctor/appointments/:id/status
```

## Admin APIs

```http
POST   /api/v1/admin/doctors
PATCH  /api/v1/admin/doctors/:id
DELETE /api/v1/admin/doctors/:id

POST   /api/v1/admin/specialties
PATCH  /api/v1/admin/specialties/:id
DELETE /api/v1/admin/specialties/:id

GET    /api/v1/admin/stats
```

---

# 11. Pagination, Search & Filtering

```http
GET /api/v1/doctors?page=1&limit=12&search=cardio&specialty=<id>&sort=rating_desc&minFee=100&maxFee=1000
```

Supported Sort Parameters:
- `rating_desc`: Highest customer rating
- `fee_asc`: Fee low to high
- `fee_desc`: Fee high to low
- `exp_desc`: Most experienced first

Standard Paginated Response Format:

```json
{
  "success": true,
  "message": "Doctors retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}
```

---

# 12. Slot Generation Engine

Given a doctor ID and date (`YYYY-MM-DD`), the backend dynamically calculates available 30-minute consultation slots by:
1. Checking the doctor's weekly shift configuration for that day of the week.
2. Filtering out slots that match already booked appointments (`PENDING` or `CONFIRMED`).
3. Returning an organized list of Morning, Afternoon, and Evening slots.

---

# 13. UI Screens & Features

- **Home Page**: Hero banner with instant booking CTA, featured specialties, top-rated doctors, hospital statistics counter, fresh healthcare aesthetic.
- **Find Doctors Page**: Filter sidebar (specialty, fee slider, rating, search bar), grid of Doctor Cards, pagination.
- **Doctor Profile & Slot Picker Modal**: Detailed biography, clinic location, fee, interactive date picker, time slot chips, booking form (patient symptom/reason), instant toast confirmation.
- **Patient Dashboard**: Upcoming appointments, past history, appointment cancellation modal, status pills.
- **Doctor Dashboard**: Today's schedule queue, patient list, status toggle buttons (`CONFIRMED`, `COMPLETED`, `CANCELLED`).
- **Admin Dashboard**: System stats cards (Total Doctors, Active Specialties, Appointments Today, System Revenue), Add/Edit Doctor Modal, Specialty Manager table.

---

# 14. Phase 2 Verification Checklist

- [x] Doctor & Specialty models defined
- [x] Appointment status workflow implemented
- [x] Real-time slot availability generator built
- [x] JWT authentication & role authorization enforced
- [x] Search, specialty filter, fee filter & sorting functional
- [x] Patient booking & Patient Portal complete
- [x] Doctor consultation queue portal complete
- [x] Admin Doctor & Specialty management complete
- [x] Mobile responsive layout verified
- [x] Seed data initialized for instant testing

# END OF PHASE 2 DOCTOR APPOINTMENT SPECIFICATION
