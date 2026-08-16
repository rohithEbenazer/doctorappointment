const bcrypt = require('bcryptjs');

// Helper to hash default passwords synchronously for seed data
const hashPassword = (password) => bcrypt.hashSync(password, 10);

const db = {
  users: [
    {
      _id: 'usr_patient_1',
      name: 'John Doe',
      email: 'patient@hospital.com',
      password: hashPassword('password123'),
      role: 'PATIENT',
      phone: '+1 (555) 234-5678',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_patient_2',
      name: 'Emily Davis',
      email: 'emily@hospital.com',
      password: hashPassword('password123'),
      role: 'PATIENT',
      phone: '+1 (555) 345-6789',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_doctor_1',
      name: 'Dr. Sarah Jenkins',
      email: 'doctor.smith@hospital.com',
      password: hashPassword('password123'),
      role: 'DOCTOR',
      phone: '+1 (555) 987-6543',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_doctor_2',
      name: 'Dr. Marcus Vance',
      email: 'marcus@hospital.com',
      password: hashPassword('password123'),
      role: 'DOCTOR',
      phone: '+1 (555) 876-5432',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_admin_1',
      name: 'Hospital Administrator',
      email: 'admin@hospital.com',
      password: hashPassword('password123'),
      role: 'ADMIN',
      phone: '+1 (555) 111-2222',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_super_admin_1',
      name: 'System Super Admin',
      email: 'superadmin@hospital.com',
      password: hashPassword('password123'),
      role: 'SUPER_ADMIN',
      phone: '+1 (555) 000-0000',
      createdAt: new Date().toISOString()
    }
  ],

  specialties: [
    {
      _id: 'spec_1',
      name: 'Cardiology',
      slug: 'cardiology',
      description: 'Expert heart & cardiovascular disease diagnosis, treatment, and preventive care.',
      icon: 'Heart',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'spec_2',
      name: 'Neurology',
      slug: 'neurology',
      description: 'Comprehensive brain, spinal cord, and nerve disorder medical care.',
      icon: 'Brain',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'spec_3',
      name: 'Orthopedics',
      slug: 'orthopedics',
      description: 'Joint replacement, bone fractures, sports injuries, and spine specialist care.',
      icon: 'Bone',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'spec_4',
      name: 'Pediatrics',
      slug: 'pediatrics',
      description: 'Specialized healthcare, immunization, and wellness care for infants and children.',
      icon: 'Baby',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'spec_5',
      name: 'Dermatology',
      slug: 'dermatology',
      description: 'Advanced skin, hair, and nail treatment, acne therapy, and cosmetic dermatology.',
      icon: 'Sparkles',
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'spec_6',
      name: 'General Medicine',
      slug: 'general-medicine',
      description: 'Primary medical consultations, annual checkups, and routine health evaluations.',
      icon: 'Stethoscope',
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],

  doctors: [
    {
      _id: 'doc_1',
      userId: 'usr_doctor_1',
      name: 'Dr. Sarah Jenkins',
      slug: 'dr-sarah-jenkins',
      specialtyId: 'spec_1',
      qualification: 'MD, FACC - Senior Cardiologist',
      experienceYears: 14,
      consultationFee: 150,
      bio: 'Dr. Sarah Jenkins is a board-certified cardiologist with over 14 years of clinical experience in non-invasive cardiology, heart failure management, and preventive cardiovascular wellness.',
      rating: 4.9,
      reviewCount: 128,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
      clinicLocation: 'Heart Care Wing, Floor 3, Suite 302',
      isAvailable: true,
      isActive: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'doc_2',
      userId: 'usr_doctor_2',
      name: 'Dr. Marcus Vance',
      slug: 'dr-marcus-vance',
      specialtyId: 'spec_2',
      qualification: 'MD, PhD - Neurosurgeon',
      experienceYears: 18,
      consultationFee: 200,
      bio: 'Dr. Marcus Vance specializes in complex neurological disorders, stroke prevention, migraine therapy, and adult neuro-oncology.',
      rating: 4.8,
      reviewCount: 96,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
      clinicLocation: 'Neuroscience Center, Floor 4, Suite 410',
      isAvailable: true,
      isActive: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '10:00', endTime: '16:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Wednesday', startTime: '10:00', endTime: '16:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '10:00', endTime: '16:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'doc_3',
      userId: 'usr_doctor_3',
      name: 'Dr. Elena Rostova',
      slug: 'dr-elena-rostova',
      specialtyId: 'spec_4',
      qualification: 'MD, DCH - Pediatric Specialist',
      experienceYears: 10,
      consultationFee: 120,
      bio: 'Compassionate child healthcare specialist dedicated to infant nutrition, developmental milestones, vaccination, and adolescent medicine.',
      rating: 5.0,
      reviewCount: 215,
      avatar: 'https://images.unsplash.com/photo-1594824813566-8185b378b77c?q=80&w=400&auto=format&fit=crop',
      clinicLocation: 'Children Wellness Block, Floor 2, Suite 205',
      isAvailable: true,
      isActive: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '08:30', endTime: '16:30', slotDurationMinutes: 30 },
        { dayOfWeek: 'Tuesday', startTime: '08:30', endTime: '16:30', slotDurationMinutes: 30 },
        { dayOfWeek: 'Thursday', startTime: '08:30', endTime: '16:30', slotDurationMinutes: 30 },
        { dayOfWeek: 'Saturday', startTime: '09:00', endTime: '13:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'doc_4',
      userId: 'usr_doctor_4',
      name: 'Dr. Robert Chen',
      slug: 'dr-robert-chen',
      specialtyId: 'spec_3',
      qualification: 'MS, MCh - Orthopedic Surgeon',
      experienceYears: 15,
      consultationFee: 180,
      bio: 'Pioneer in minimally invasive joint replacement surgeries, sports medicine, arthritis care, and complex fracture reconstructive procedures.',
      rating: 4.7,
      reviewCount: 84,
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
      clinicLocation: 'Orthopedics & Joint Clinic, Floor 1, Suite 108',
      isAvailable: true,
      isActive: true,
      availability: [
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '15:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'doc_5',
      userId: 'usr_doctor_5',
      name: 'Dr. Aisha Patel',
      slug: 'dr-aisha-patel',
      specialtyId: 'spec_5',
      qualification: 'MD, DVD - Consultant Dermatologist',
      experienceYears: 9,
      consultationFee: 130,
      bio: 'Expert in clinical dermatology, laser skin therapy, anti-aging solutions, pediatric skin conditions, and allergic skin disorders.',
      rating: 4.9,
      reviewCount: 142,
      avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?q=80&w=400&auto=format&fit=crop',
      clinicLocation: 'Skin & Aesthetic Center, Floor 5, Suite 501',
      isAvailable: true,
      isActive: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '11:00', endTime: '19:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Wednesday', startTime: '11:00', endTime: '19:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '11:00', endTime: '19:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'doc_6',
      userId: 'usr_doctor_6',
      name: 'Dr. David Miller',
      slug: 'dr-david-miller',
      specialtyId: 'spec_6',
      qualification: 'MBBS, MD - General Physician',
      experienceYears: 12,
      consultationFee: 100,
      bio: 'Trusted family practitioner providing holistic health diagnostics, diabetes care, hypertension management, and wellness counseling.',
      rating: 4.8,
      reviewCount: 176,
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop',
      clinicLocation: 'Outpatient Care Wing, Floor 1, Suite 101',
      isAvailable: true,
      isActive: true,
      availability: [
        { dayOfWeek: 'Monday', startTime: '08:00', endTime: '16:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '16:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '16:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Thursday', startTime: '08:00', endTime: '16:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '08:00', endTime: '16:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    }
  ],

  appointments: [
    {
      _id: 'apt_101',
      patientId: 'usr_patient_1',
      doctorId: 'doc_1',
      specialtyId: 'spec_1',
      appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      timeSlot: '10:30 AM',
      status: 'CONFIRMED',
      reason: 'Routine cardiovascular checkup & ECG review.',
      patientNotes: 'Experiencing mild palpitations after workout.',
      doctorNotes: 'Patient advised to bring past lipid profile reports.',
      fee: 150,
      paymentStatus: 'PAID',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      _id: 'apt_102',
      patientId: 'usr_patient_2',
      doctorId: 'doc_1',
      specialtyId: 'spec_1',
      appointmentDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
      timeSlot: '02:00 PM',
      status: 'PENDING',
      reason: 'Hypertension consultation and prescription review.',
      patientNotes: 'First time consultation.',
      doctorNotes: '',
      fee: 150,
      paymentStatus: 'PENDING',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      _id: 'apt_103',
      patientId: 'usr_patient_1',
      doctorId: 'doc_2',
      specialtyId: 'spec_2',
      appointmentDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      timeSlot: '11:00 AM',
      status: 'COMPLETED',
      reason: 'Chronic migraine and neurological evaluation.',
      patientNotes: 'Frequent headaches over last 2 weeks.',
      doctorNotes: 'Prescribed preventative therapy and scheduled follow-up MRI in 3 months.',
      fee: 200,
      paymentStatus: 'PAID',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      _id: 'apt_104',
      patientId: 'usr_patient_2',
      doctorId: 'doc_3',
      specialtyId: 'spec_4',
      appointmentDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      timeSlot: '09:30 AM',
      status: 'CANCELLED',
      reason: 'Routine pediatric checkup.',
      patientNotes: 'Schedule conflict.',
      doctorNotes: 'Cancelled by patient.',
      fee: 120,
      paymentStatus: 'PENDING',
      createdAt: new Date(Date.now() - 259200000).toISOString()
    }
  ]
};

module.exports = db;
