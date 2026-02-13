export const HEALTHCARE_NAICS_CODES = [
  // Medical Practice
  {
    key: "621111",
    code: "621111",
    category: "Medical Practice",
    label: "Primary Care Physician / Family Medicine",
  },
  {
    key: "621111-SP",
    code: "621111",
    category: "Medical Practice",
    label: "Specialist Physician (Cardiology, Oncology, etc.)",
  },
  {
    key: "621111-SG",
    code: "621111",
    category: "Medical Practice",
    label: "Surgeons & Surgical Centers",
  },
  {
    key: "621112",
    code: "621112",
    category: "Medical Practice",
    label: "Psychiatrist / Psychoanalyst Office",
  },

  // Dental Practice
  {
    key: "621210",
    code: "621210",
    category: "Dental Practice",
    label: "General Dentist / Orthodontist / Periodontist",
  },

  // Specialists
  { key: "621310", code: "621310", category: "Specialists", label: "Chiropractor" },
  {
    key: "621320",
    code: "621320",
    category: "Specialists",
    label: "Optometrist / Eye Care Specialist",
  },
  {
    key: "621330",
    code: "621330",
    category: "Specialists",
    label: "Psychologist / Clinical Social Worker",
  },
  {
    key: "621330-MF",
    code: "621330",
    category: "Specialists",
    label: "Marriage & Family Therapist (LMFT)",
  },
  {
    key: "621340-PT",
    code: "621340",
    category: "Specialists",
    label: "Physical Therapist Office",
  },
  {
    key: "621340-OT",
    code: "621340",
    category: "Specialists",
    label: "Occupational Therapist Office",
  },
  {
    key: "621340-SP",
    code: "621340",
    category: "Specialists",
    label: "Speech Pathologist / Audiologist",
  },
  { key: "621391", code: "621391", category: "Specialists", label: "Podiatrist (DPM)" },

  // Misc. Specialist
  { key: "621399-AC", code: "621399", category: "Misc. Specialist", label: "Acupuncturist" },
  {
    key: "621399-NH",
    code: "621399",
    category: "Misc. Specialist",
    label: "Naturopath / Homeopath",
  },
  {
    key: "621399-MW",
    code: "621399",
    category: "Misc. Specialist",
    label: "Midwife / Birthing Consultant",
  },
  {
    key: "621399-RD",
    code: "621399",
    category: "Misc. Specialist",
    label: "Registered Dietitian / Nutritionist",
  },
  {
    key: "621399-HT",
    code: "621399",
    category: "Misc. Specialist",
    label: "Hypnotherapist",
  },
  {
    key: "621399-RT",
    code: "621399",
    category: "Misc. Specialist",
    label: "Inhalation / Respiratory Therapist",
  },
  {
    key: "621399-NP",
    code: "621399",
    category: "Misc. Specialist",
    label: "Nurse Practitioner (Independent Practice)",
  },
  {
    key: "621399-PA",
    code: "621399",
    category: "Misc. Specialist",
    label: "Physician Assistant (Independent Practice)",
  },
  { key: "621399-HB", code: "621399", category: "Misc. Specialist", label: "Herbalist" },

  // Management (MSO)
  {
    key: "541611",
    code: "541611",
    category: "Management (MSO)",
    label: "Management Services Organization (MSO)",
  },
  {
    key: "561110",
    code: "561110",
    category: "Management (MSO)",
    label: "Medical Office Admin / Virtual Assistant Firm",
  },

  // Support Services
  {
    key: "541219",
    code: "541219",
    category: "Support Services",
    label: "Medical Billing, Coding & Revenue Cycle",
  },

  // Facilities
  {
    key: "621493-UC",
    code: "621493",
    category: "Facilities",
    label: "Urgent Care / Emergency Clinic",
  },
  {
    key: "621493-ASC",
    code: "621493",
    category: "Facilities",
    label: "Ambulatory Surgery Center (ASC)",
  },

  // Diagnostics
  {
    key: "621511",
    code: "621511",
    category: "Diagnostics",
    label: "Medical Laboratory (Pathology)",
  },
  {
    key: "621512",
    code: "621512",
    category: "Diagnostics",
    label: "Imaging Center (MRI/X-Ray/Ultrasound)",
  },

  // Home Care
  {
    key: "621610",
    code: "621610",
    category: "Home Care",
    label: "Home Health Care Agency",
  },

  // Health Tech
  {
    key: "518210",
    code: "518210",
    category: "Health Tech",
    label: "Telemedicine Platform / Health SaaS",
  },
  {
    key: "541511",
    code: "541511",
    category: "Health Tech",
    label: "Medical Software Development",
  },

  // Specialty
  {
    key: "621991",
    code: "621991",
    category: "Specialty",
    label: "Blood Bank / Plasma Center / Organ Procurement",
  },
  {
    key: "621999-MM",
    code: "621999",
    category: "Specialty",
    label: "Medical Marijuana Clinic",
  },
  {
    key: "621999-HS",
    code: "621999",
    category: "Specialty",
    label: "Health Screening & Physical Exam Services",
  },
  {
    key: "621999-PM",
    code: "621999",
    category: "Specialty",
    label: "Pacemaker / Remote Monitoring Service",
  },
] as const;

export function resolveNaicsCode(key: string): string {
  return HEALTHCARE_NAICS_CODES.find((t) => t.key === key)?.code ?? key;
}
