import { useState } from 'react'
import type { ContactFormFields } from '@/types/contact'

export type ContactFormStep = 1 | 2 | 3

const initialFields: ContactFormFields = {
  fullName: '',
  email: '',
  service: '',
  companyOrProject: '',
  projectDescription: '',
  timeline: '',
  budget: undefined,
  materialsLink: '',
  phone: '',
  contactPreference: undefined,
  privacyAccepted: false,
}

export function isStepValid(step: ContactFormStep, fields: ContactFormFields): boolean {
  if (step === 1) {
    return fields.fullName.trim().length > 0 && /\S+@\S+\.\S+/.test(fields.email) && fields.service.trim().length > 0
  }
  if (step === 2) {
    return fields.projectDescription.trim().length > 0 && fields.timeline.trim().length > 0
  }
  return fields.privacyAccepted
}

export function useContactFormState() {
  const [step, setStep] = useState<ContactFormStep>(1)
  const [fields, setFields] = useState<ContactFormFields>(initialFields)

  function updateField<K extends keyof ContactFormFields>(key: K, value: ContactFormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }))
  }

  function goNext() {
    if (!isStepValid(step, fields)) return
    setStep((prev) => (prev < 3 ? ((prev + 1) as ContactFormStep) : prev))
  }

  function goBack() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as ContactFormStep) : prev))
  }

  return { step, fields, updateField, goNext, goBack, isStepValid: isStepValid(step, fields) }
}
