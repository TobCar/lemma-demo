"use client";

import { useOnboarding } from "@/contexts/OnboardingContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ORGANIZATION_TYPES } from "@/data/organizations";
import { US_STATES } from "@/data/usStates";
import { HEALTHCARE_NAICS_CODES, resolveNaicsCode } from "@/data/naicsCodes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { CreateLegalEntityRequest } from "@/types/onboarding";
import { uploadFile } from "@/lib/uploadFile";
import { createClient } from "@/lib/supabase/client";

export function ReviewStep() {
  const {
    formData,
    updateIdentityVerification,
    setCurrentStep,
    setIsSubmitting,
    setIsComplete,
    isSubmitting,
  } = useOnboarding();
  const { businessProfile, owners, identityVerification } = formData;
  const [termsAccepted, setTermsAccepted] = useState(
    identityVerification.termsAccepted,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        updateIdentityVerification({ termsIpAddress: data.ip });
      } catch {
        updateIdentityVerification({ termsIpAddress: "0.0.0.0" });
      }
    };
    if (!identityVerification.termsIpAddress) {
      fetchIP();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    updateIdentityVerification({
      termsAccepted: checked,
      termsTimestamp: checked ? new Date().toISOString() : "",
    });
  };

  const handleSubmit = async () => {
    if (!termsAccepted) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const orgType = ORGANIZATION_TYPES.find(
        (o) => o.value === businessProfile.organizationType,
      );
      const npi =
        businessProfile.npiType === "type1"
          ? businessProfile.individualNpi
          : businessProfile.practiceNpi;

      let ss4FileKey: string | undefined;
      if (businessProfile.ss4File) {
        ss4FileKey = await uploadFile(businessProfile.ss4File);
      }

      const body: CreateLegalEntityRequest = {
        legalBusinessName: businessProfile.legalBusinessName,
        url: businessProfile.website,
        businessPhone: businessProfile.businessPhone,
        organizationType: orgType?.value ?? businessProfile.organizationType,
        practiceNpi: npi,
        naicsCode: resolveNaicsCode(businessProfile.naicsCode),
        ipAddress: identityVerification.termsIpAddress,
        ss4FileKey,
      };

      const response = await fetch("/api/legal-entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Something went wrong");
      }

      // Refresh the session so the JWT picks up the new user_role claim
      const supabase = createClient();
      await supabase.auth.refreshSession();

      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const leader = owners.find((o) => o.prongs.includes("control")) || owners[0];
  const beneficialOwners = owners.filter((o) => o.prongs.includes("ownership"));

  const formatBankAddress = (addr: typeof businessProfile.address) => {
    const line1 = addr.line1.toUpperCase();
    const line2 = addr.line2 ? addr.line2.toUpperCase() : null;
    const cityStateZip = `${addr.city.toUpperCase()}, ${addr.state} ${addr.zip}`;

    return { line1, line2, cityStateZip };
  };

  const getMaskedSSN = (ssn: string) => {
    const digits = ssn.replace(/-/g, "");
    if (digits.length < 4)
      return "\u2022\u2022\u2022-\u2022\u2022-\u2022\u2022\u2022\u2022";
    return `\u2022\u2022\u2022-\u2022\u2022-${digits.slice(-4)}`;
  };

  const getTypeLabel = (code: string) => {
    return (
      HEALTHCARE_NAICS_CODES.find((t) => t.key === code)?.label ||
      code ||
      "\u2014"
    );
  };

  const getStructureLabel = (value: string) => {
    const orgType = ORGANIZATION_TYPES.find((o) => o.value === value);
    return orgType?.label || value || "\u2014";
  };

  const getStateLabel = (value: string) => {
    const state = US_STATES.find((s) => s.value === value);
    return state?.label || value || "\u2014";
  };

  const bankAddress = formatBankAddress(businessProfile.address);
  const ownerAddress = leader ? formatBankAddress(leader.address) : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="onboarding-header">Check your details</h1>
        <p className="onboarding-subheader">
          Confirm everything looks correct before creating your account.
        </p>
      </div>

      <div className="review-section">
        <h3 className="review-section-title">Organization Information</h3>
        <div>
          <div className="review-row">
            <span className="review-label">Organization name</span>
            <span className="review-value">
              {businessProfile.legalBusinessName || "\u2014"}
            </span>
          </div>
          <div className="review-row">
            <span className="review-label">Website</span>
            <span className="review-value">
              {businessProfile.website || "\u2014"}
            </span>
          </div>
          <div className="review-row">
            <span className="review-label">Type</span>
            <span className="review-value">
              {getTypeLabel(businessProfile.naicsCode)}
            </span>
          </div>
          <div className="review-row">
            <span className="review-label">Organization structure</span>
            <span className="review-value">
              {getStructureLabel(businessProfile.organizationType)}
            </span>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3 className="review-section-title">Organization Details</h3>
        <div>
          <div className="review-row">
            <span className="review-label">State of incorporation</span>
            <span className="review-value">
              {getStateLabel(businessProfile.incorporationState)}
            </span>
          </div>
          <div className="review-row">
            <span className="review-label">Number of locations</span>
            <span className="review-value">
              {businessProfile.locationCount
                ? `${businessProfile.locationCount} location${businessProfile.locationCount > 1 ? "s" : ""}`
                : "\u2014"}
            </span>
          </div>
          {businessProfile.locationCount !== null &&
            businessProfile.locationCount > 1 && (
              <div className="review-row">
                <span className="review-label">Shared Tax ID</span>
                <span className="review-value">
                  {businessProfile.sharedTaxId === null
                    ? "\u2014"
                    : businessProfile.sharedTaxId
                      ? "Yes"
                      : "No"}
                </span>
              </div>
            )}
          <div className="review-row">
            <span className="review-label">NPI</span>
            <span className="review-value">
              {businessProfile.npiType === "type1"
                ? `${businessProfile.individualNpi || "\u2014"} (Individual)`
                : `${businessProfile.practiceNpi || "\u2014"} (Organizational)`}
            </span>
          </div>
          <div className="review-row">
            <span className="review-label">Tax ID (EIN)</span>
            <span className="review-value">
              {businessProfile.ss4File
                ? "SS-4 form uploaded"
                : businessProfile.ein || "\u2014"}
            </span>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3 className="review-section-title">Contact Information</h3>
        <div>
          <div className="review-row">
            <span className="review-label">Business address</span>
            <div className="review-value font-mono text-[13px] leading-relaxed">
              <div>{bankAddress.line1 || "\u2014"}</div>
              {bankAddress.line2 && <div>{bankAddress.line2}</div>}
              <div>{bankAddress.cityStateZip}</div>
            </div>
          </div>
          <div className="review-row">
            <span className="review-label">Business email</span>
            <span className="review-value">
              {businessProfile.businessEmail || "\u2014"}
            </span>
          </div>
          <div className="review-row">
            <span className="review-label">Business phone</span>
            <span className="review-value">
              {businessProfile.businessPhone || "\u2014"}
            </span>
          </div>
        </div>
      </div>

      {leader && leader.name && (
        <div className="review-section">
          <h3 className="review-section-title">Control Person</h3>
          <div>
            <div className="review-row">
              <span className="review-label">Name</span>
              <span className="review-value">{leader.name}</span>
            </div>
            <div className="review-row">
              <span className="review-label">Title</span>
              <span className="review-value">{leader.title || "\u2014"}</span>
            </div>
            <div className="review-row">
              <span className="review-label">SSN</span>
              <span className="review-value font-mono text-[13px]">
                {getMaskedSSN(leader.ssn)}
              </span>
            </div>
            {ownerAddress && (
              <div className="review-row">
                <span className="review-label">Home address</span>
                <div className="review-value font-mono text-[13px] leading-relaxed">
                  <div>{ownerAddress.line1 || "\u2014"}</div>
                  {ownerAddress.line2 && <div>{ownerAddress.line2}</div>}
                  <div>{ownerAddress.cityStateZip}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {beneficialOwners.length > 0 && (
        <div className="review-section">
          <h3 className="review-section-title">Beneficial Owners</h3>
          <div>
            {beneficialOwners.map((owner, i) => (
              <div key={i} className="review-row">
                <span className="review-label">{owner.name || "Owner"}</span>
                <span className="review-value font-mono text-[13px]">
                  {getMaskedSSN(owner.ssn)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-border space-y-4">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          By clicking &quot;Create My Account&quot; you attest that you have
          reviewed the documents, agree to the Electronic Signatures in Global
          and National Commerce Act Disclosure, and consent to the Privacy
          Policy and Fee Schedule.
        </p>

        <label className="checkbox-label">
          <Checkbox
            checked={termsAccepted}
            onCheckedChange={handleTermsChange}
          />
          <span>I agree to the terms and conditions</span>
        </label>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p>Something went wrong on our end! Please contact our team.</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="onboarding-button-row">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(4)}
          disabled={isSubmitting}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!termsAccepted || isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create My Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
