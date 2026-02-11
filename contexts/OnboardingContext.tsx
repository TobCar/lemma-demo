"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { OnboardingFormData, OwnerData } from '@/types/onboarding';

interface OnboardingContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  formData: OnboardingFormData;
  updateBusinessProfile: (data: Partial<OnboardingFormData['businessProfile']>) => void;
  updateOwners: (owners: OwnerData[]) => void;
  addOwner: () => void;
  removeOwner: (id: string) => void;
  updateOwner: (id: string, data: Partial<OwnerData>) => void;
  updateIdentityVerification: (data: Partial<OnboardingFormData['identityVerification']>) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
  getApiPayload: () => object;
}

const defaultOwner = (): OwnerData => ({
  id: crypto.randomUUID(),
  name: '',
  title: '',
  dateOfBirth: null,
  ssn: '',
  prongs: [],
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
  },
});

const defaultFormData: OnboardingFormData = {
  businessProfile: {
    legalBusinessName: '',
    ein: '',
    website: '',
    naicsCode: '621111',
    incorporationState: '',
    organizationType: 'pc',
    ss4File: null,
    practiceNpi: '',
    individualNpi: '',
    npiType: 'type2',
    locationCount: null,
    sharedTaxId: null,
    businessEmail: '',
    businessPhone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    },
  },
  owners: [defaultOwner()],
  identityVerification: {
    idFrontFile: null,
    idBackFile: null,
    termsAccepted: false,
    termsIpAddress: '',
    termsTimestamp: '',
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const updateBusinessProfile = useCallback((data: Partial<OnboardingFormData['businessProfile']>) => {
    setFormData(prev => ({
      ...prev,
      businessProfile: { ...prev.businessProfile, ...data },
    }));
  }, []);

  const updateOwners = useCallback((owners: OwnerData[]) => {
    setFormData(prev => ({ ...prev, owners }));
  }, []);

  const addOwner = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      owners: [...prev.owners, defaultOwner()],
    }));
  }, []);

  const removeOwner = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.filter(o => o.id !== id),
    }));
  }, []);

  const updateOwner = useCallback((id: string, data: Partial<OwnerData>) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.map(o => (o.id === id ? { ...o, ...data } : o)),
    }));
  }, []);

  const updateIdentityVerification = useCallback((data: Partial<OnboardingFormData['identityVerification']>) => {
    setFormData(prev => ({
      ...prev,
      identityVerification: { ...prev.identityVerification, ...data },
    }));
  }, []);

  const getApiPayload = useCallback(() => {
    const { businessProfile, owners, identityVerification } = formData;

    const payload = {
      structure: 'corporation',
      corporation: {
        name: businessProfile.legalBusinessName,
        tax_identifier: businessProfile.ein.replace(/-/g, ''),
        website: businessProfile.website || undefined,
        industry_code: businessProfile.naicsCode || undefined,
        address: {
          line1: businessProfile.address.line1,
          line2: businessProfile.address.line2 || undefined,
          city: businessProfile.address.city,
          state: businessProfile.address.state,
          zip: businessProfile.address.zip,
        },
        beneficial_owners: owners.map(owner => ({
          company_title: owner.title || undefined,
          individual: {
            name: owner.name,
            date_of_birth: owner.dateOfBirth
              ? owner.dateOfBirth.toISOString().split('T')[0]
              : '',
            address: {
              line1: owner.address.line1,
              line2: owner.address.line2 || undefined,
              city: owner.address.city,
              state: owner.address.state,
              zip: owner.address.zip,
              country: 'US',
            },
            identification: {
              method: 'social_security_number',
              number: owner.ssn.replace(/-/g, ''),
            },
          },
          prongs: owner.prongs,
        })),
      },
      terms_agreements: identityVerification.termsAccepted ? [{
        agreed_at: identityVerification.termsTimestamp,
        ip_address: identityVerification.termsIpAddress,
        terms_url: 'https://lemma.health/terms',
      }] : undefined,
    };

    return payload;
  }, [formData]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        updateBusinessProfile,
        updateOwners,
        addOwner,
        removeOwner,
        updateOwner,
        updateIdentityVerification,
        isSubmitting,
        setIsSubmitting,
        isComplete,
        setIsComplete,
        getApiPayload,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
