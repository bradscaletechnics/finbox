import { useDiscovery, Beneficiary, SigningAuthority, UBODeclaration } from "../DiscoveryContext";
import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const CANADIAN_PROVINCES = [
  "Alberta", "British Columbia", "Manitoba", "New Brunswick",
  "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia",
  "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon",
];

function FieldGroup({ label, helper, children, className = "", error = false, id }: { label: string; helper?: string; children: React.ReactNode; className?: string; error?: boolean; id?: string }) {
  return (
    <div className={cn(className, error && "rounded-lg ring-1 ring-destructive/40 bg-destructive/5 px-3 pt-3 pb-2 -mx-3")} id={id}>
      <label className={cn("mb-1.5 block text-xs font-medium", error ? "text-destructive" : "text-muted-foreground")}>
        {label}{error && <span className="ml-1 font-normal text-destructive/70">— required</span>}
      </label>
      {children}
      {helper && <p className="mt-1 text-xs text-muted-foreground/60">{helper}</p>}
    </div>
  );
}

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

function YesNoToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      {["Yes", "No"].map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt === "Yes")}
          className={cn("rounded-button px-4 py-2 text-sm font-medium border transition-colors",
            (opt === "Yes" ? value : !value) ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
          )}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function YesNoButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {["Yes", "No"].map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={cn("rounded-button px-4 py-2 text-sm font-medium border transition-colors",
            value === opt ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
          )}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export function PersonalInfo() {
  const { data, updateData, highlightMissing } = useDiscovery();
  const err = (val: string | undefined | null) => highlightMissing && (!val || !val.trim());

  const age = useMemo(() => {
    if (!data.dateOfBirth) return null;
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) a--;
    return a >= 0 ? a : null;
  }, [data.dateOfBirth]);

  const updateBeneficiary = (i: number, u: Partial<Beneficiary>) =>
    updateData({ beneficiaries: data.beneficiaries.map((b, idx) => idx === i ? { ...b, ...u } : b) });
  const addBeneficiary = () => updateData({ beneficiaries: [...data.beneficiaries, { name: "", relationship: "", percentage: 0 }] });
  const removeBeneficiary = (i: number) => { if (data.beneficiaries.length > 1) updateData({ beneficiaries: data.beneficiaries.filter((_, idx) => idx !== i) }); };

  const updateSA = (i: number, u: Partial<SigningAuthority>) =>
    updateData({ signingAuthorities: data.signingAuthorities.map((s, idx) => idx === i ? { ...s, ...u } : s) });
  const addSA = () => updateData({ signingAuthorities: [...data.signingAuthorities, { name: "", email: "" }] });
  const removeSA = (i: number) => { if (data.signingAuthorities.length > 1) updateData({ signingAuthorities: data.signingAuthorities.filter((_, idx) => idx !== i) }); };

  const updateUBO = (i: number, u: Partial<UBODeclaration>) =>
    updateData({ uboDeclarations: data.uboDeclarations.map((d, idx) => idx === i ? { ...d, ...u } : d) });
  const addUBO = () => updateData({ uboDeclarations: [...data.uboDeclarations, { name: "", dateOfBirth: "", sin: "", address: "", citizenship: "", ownershipPercent: "", isPEP: "" }] });
  const removeUBO = (i: number) => updateData({ uboDeclarations: data.uboDeclarations.filter((_, idx) => idx !== i) });

  const maskSIN = (v: string) => {
    const d = v.replace(/[^0-9]/g, "").slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 6) return d.slice(0, 3) + "-" + d.slice(3);
    return d.slice(0, 3) + "-" + d.slice(3, 6) + "-" + d.slice(6);
  };

  const fmtCurrency = (v: string) => { const n = v.replace(/[^0-9]/g, ""); return n ? Number(n).toLocaleString("en-CA") : ""; };

  const isIFA = data.productCategory === "IFA" || data.ownerType === "Corporate";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">Basic client details and contact information.</p>
      </div>

      {/* Name */}
      <div className="grid grid-cols-3 gap-4">
        <FieldGroup id="field-firstName" label="First Name" error={err(data.firstName)}><input className={inputClass} placeholder="First name" value={data.firstName} onChange={(e) => updateData({ firstName: e.target.value })} /></FieldGroup>
        <FieldGroup label="Middle Name"><input className={inputClass} placeholder="Middle name" value={data.middleName} onChange={(e) => updateData({ middleName: e.target.value })} /></FieldGroup>
        <FieldGroup id="field-lastName" label="Last Name" error={err(data.lastName)}><input className={inputClass} placeholder="Last name" value={data.lastName} onChange={(e) => updateData({ lastName: e.target.value })} /></FieldGroup>
      </div>

      {/* DOB + SIN */}
      <div className="grid grid-cols-3 gap-4">
        <FieldGroup id="field-dateOfBirth" label="Date of Birth" error={err(data.dateOfBirth)}><input type="date" className={inputClass} value={data.dateOfBirth} onChange={(e) => updateData({ dateOfBirth: e.target.value })} /></FieldGroup>
        <FieldGroup label="Age">
          <div className="flex h-[38px] items-center rounded-button border border-border bg-secondary/30 px-3 text-sm font-mono text-foreground">{age !== null ? `${age} years` : "—"}</div>
        </FieldGroup>
        <FieldGroup label="SIN (Social Insurance Number)">
          <input className={inputClass} placeholder="XXX-XXX-XXX" value={maskSIN(data.sin)} onChange={(e) => updateData({ sin: e.target.value.replace(/[^0-9]/g, "").slice(0, 9) })} />
        </FieldGroup>
      </div>

      {/* Gender + Smoker + Canadian Status */}
      <div className="grid grid-cols-3 gap-4">
        <FieldGroup id="field-gender" label="Gender" error={err(data.gender)}>
          <select className={inputClass} value={data.gender} onChange={(e) => updateData({ gender: e.target.value })}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </FieldGroup>
        <FieldGroup id="field-smokerStatus" label="Smoker Status" error={err(data.smokerStatus)}>
          <select className={inputClass} value={data.smokerStatus} onChange={(e) => updateData({ smokerStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="Non-Smoker">Non-Smoker</option>
            <option value="Smoker">Smoker</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Canadian Status">
          <select className={selectClass} value={data.canadianStatus} onChange={(e) => updateData({ canadianStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="Canadian Citizen">Canadian Citizen</option>
            <option value="Permanent Resident">Permanent Resident</option>
            <option value="Work Permit">Work Permit</option>
            <option value="Study Permit">Study Permit</option>
            <option value="Other">Other</option>
          </select>
        </FieldGroup>
      </div>

      {/* Height + Weight (medical underwriting triggers) */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Height" helper="Used to determine medical underwriting requirements">
          <input className={inputClass} placeholder="e.g. 5'11&quot; or 180 cm" value={data.height} onChange={(e) => updateData({ height: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Weight" helper="Used to determine medical underwriting requirements">
          <input className={inputClass} placeholder="e.g. 175 lbs or 79 kg" value={data.weight} onChange={(e) => updateData({ weight: e.target.value })} />
        </FieldGroup>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <FieldGroup label="Street Address"><input className={inputClass} placeholder="123 Main St" value={data.street} onChange={(e) => updateData({ street: e.target.value })} /></FieldGroup>
        <div className="grid grid-cols-3 gap-4">
          <FieldGroup label="City"><input className={inputClass} placeholder="City" value={data.city} onChange={(e) => updateData({ city: e.target.value })} /></FieldGroup>
          <FieldGroup label="Province">
            <select className={selectClass} value={data.province} onChange={(e) => updateData({ province: e.target.value })}>
              <option value="">Select</option>
              {CANADIAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="Postal Code"><input className={inputClass} placeholder="A1A 1A1" value={data.postalCode} onChange={(e) => updateData({ postalCode: e.target.value.toUpperCase() })} /></FieldGroup>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup id="field-phone" label="Phone" error={err(data.phone)}><input className={inputClass} placeholder="(604) 555-0100" value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} /></FieldGroup>
        <FieldGroup id="field-email" label="Email" error={err(data.email)}><input type="email" className={inputClass} placeholder="client@email.com" value={data.email} onChange={(e) => updateData({ email: e.target.value })} /></FieldGroup>
      </div>

      {/* Marital + Employment */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup id="field-maritalStatus" label="Marital Status" error={err(data.maritalStatus)}>
          <select className={inputClass} value={data.maritalStatus} onChange={(e) => updateData({ maritalStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Common-Law">Common-Law</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Employment Status">
          <select className={inputClass} value={data.employmentStatus} onChange={(e) => updateData({ employmentStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Retired">Retired</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FieldGroup label="Occupation"><input className={inputClass} placeholder="Occupation" value={data.occupation} onChange={(e) => updateData({ occupation: e.target.value })} /></FieldGroup>
        <FieldGroup label="Employer Name"><input className={inputClass} placeholder="Employer" value={data.employerName} onChange={(e) => updateData({ employerName: e.target.value })} /></FieldGroup>
        <FieldGroup id="field-annualIncome" label="Annual Earned Income" error={highlightMissing && !data.annualIncome}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input className={`${inputClass} pl-7 font-mono`} placeholder="100,000" value={fmtCurrency(data.annualIncome)} onChange={(e) => updateData({ annualIncome: e.target.value.replace(/[^0-9]/g, "") })} />
          </div>
        </FieldGroup>
      </div>

      {/* Beneficiaries */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Beneficiaries</h3>
            <p className="text-xs text-muted-foreground">Designate beneficiaries and allocation percentages.</p>
          </div>
          <button onClick={addBeneficiary} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"><Plus className="h-3.5 w-3.5" /> Add</button>
        </div>
        <div className="space-y-3">
          {data.beneficiaries.map((b, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_100px_32px] gap-3 items-end">
              <FieldGroup label={i === 0 ? "Name" : ""}><input className={inputClass} placeholder="Beneficiary name" value={b.name} onChange={(e) => updateBeneficiary(i, { name: e.target.value })} /></FieldGroup>
              <FieldGroup label={i === 0 ? "Relationship" : ""}>
                <select className={selectClass} value={b.relationship} onChange={(e) => updateBeneficiary(i, { relationship: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Trust">Trust</option>
                  <option value="Insured's Company">Insured's Company</option>
                  <option value="Other">Other</option>
                </select>
              </FieldGroup>
              <FieldGroup label={i === 0 ? "%" : ""}><input className={`${inputClass} font-mono text-center`} placeholder="100" value={b.percentage || ""} onChange={(e) => updateBeneficiary(i, { percentage: Number(e.target.value.replace(/[^0-9]/g, "")) })} /></FieldGroup>
              <button onClick={() => removeBeneficiary(i)} disabled={data.beneficiaries.length <= 1} className="flex h-[38px] w-[32px] items-center justify-center rounded-button text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Owner Section */}
      <div className="rounded-card border border-border bg-secondary/10 p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Policy Owner</h3>
          <p className="text-xs text-muted-foreground mt-0.5">For IFA cases the owner is almost always the corporation, not the insured.</p>
        </div>

        <FieldGroup id="field-ownerType" label="Owner Type" error={err(data.ownerType)}>
          <div className="flex gap-2">
            {["Individual", "Corporate"].map((opt) => (
              <button key={opt} type="button" onClick={() => updateData({ ownerType: opt })}
                className={cn("rounded-button px-5 py-2 text-sm font-medium border transition-colors",
                  data.ownerType === opt ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                )}>
                {opt}
              </button>
            ))}
          </div>
        </FieldGroup>

        {data.ownerType === "Corporate" && (
          <div className="space-y-5">
            {/* Basic corporate info */}
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Corporation Name"><input className={inputClass} placeholder="ABC Holdings Inc." value={data.corporateName} onChange={(e) => updateData({ corporateName: e.target.value })} /></FieldGroup>
              <FieldGroup label="Is this the operating name?"><YesNoToggle value={data.corporateIsOperatingName} onChange={(v) => updateData({ corporateIsOperatingName: v })} /></FieldGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Corporation Type">
                <select className={selectClass} value={data.corporateType} onChange={(e) => updateData({ corporateType: e.target.value })}>
                  <option value="">Select</option>
                  <option value="CCPC">Canadian Controlled Private Corporation (CCPC)</option>
                  <option value="Public Corporation">Public Corporation</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Trust">Trust</option>
                  <option value="Other">Other</option>
                </select>
              </FieldGroup>
              <FieldGroup label="Province of Incorporation">
                <select className={selectClass} value={data.corporateProvince} onChange={(e) => updateData({ corporateProvince: e.target.value })}>
                  <option value="">Select</option>
                  {CANADIAN_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  <option value="Federal">Federal</option>
                </select>
              </FieldGroup>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FieldGroup label="Incorporation / Reg. Number"><input className={inputClass} placeholder="BC1234567" value={data.corporateIncorporationNumber} onChange={(e) => updateData({ corporateIncorporationNumber: e.target.value })} /></FieldGroup>
              <FieldGroup label="Date of Incorporation"><input type="date" className={inputClass} value={data.corporateDateOfIncorporation} onChange={(e) => updateData({ corporateDateOfIncorporation: e.target.value })} /></FieldGroup>
              <FieldGroup label="Fiscal Year End"><input className={inputClass} placeholder="e.g. December 31" value={data.corporateFiscalYearEnd} onChange={(e) => updateData({ corporateFiscalYearEnd: e.target.value })} /></FieldGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="CRA Business Number (BN)"><input className={inputClass} placeholder="123456789" value={data.corporateBusinessNumber} onChange={(e) => updateData({ corporateBusinessNumber: e.target.value })} /></FieldGroup>
            </div>

            {/* Signing Authorities */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Signing Authorities</h4>
                  <p className="text-xs text-muted-foreground">Officers authorized to sign and bind the corporation.</p>
                </div>
                <button onClick={addSA} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"><Plus className="h-3.5 w-3.5" /> Add</button>
              </div>
              <div className="space-y-3">
                {data.signingAuthorities.map((s, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-3 items-end">
                    <FieldGroup label={i === 0 ? "Name" : ""}><input className={inputClass} placeholder="Full name" value={s.name} onChange={(e) => updateSA(i, { name: e.target.value })} /></FieldGroup>
                    <FieldGroup label={i === 0 ? "Email" : ""}><input type="email" className={inputClass} placeholder="officer@company.com" value={s.email} onChange={(e) => updateSA(i, { email: e.target.value })} /></FieldGroup>
                    <button onClick={() => removeSA(i)} disabled={data.signingAuthorities.length <= 1} className="flex h-[38px] w-[32px] items-center justify-center rounded-button text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* UBO Declarations — IFA / all corporate */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground">Ultimate Beneficial Owners (UBO)</h4>
                  <p className="text-xs text-muted-foreground">FINTRAC requires declaration of all individuals with 25% or more ownership. Mandatory for all corporate-owned policies.</p>
                </div>
                <button onClick={addUBO} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary transition-colors"><Plus className="h-3.5 w-3.5" /> Add UBO</button>
              </div>
              {data.uboDeclarations.length === 0 ? (
                <p className="rounded-card border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">Click "Add UBO" to declare beneficial owners (25%+ ownership).</p>
              ) : (
                <div className="space-y-4">
                  {data.uboDeclarations.map((u, i) => (
                    <div key={i} className="rounded-card border border-border bg-secondary/20 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-foreground">UBO #{i + 1}</p>
                        <button onClick={() => removeUBO(i)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <FieldGroup label="Full Legal Name"><input className={inputClass} placeholder="Full name" value={u.name} onChange={(e) => updateUBO(i, { name: e.target.value })} /></FieldGroup>
                        <FieldGroup label="Date of Birth"><input type="date" className={inputClass} value={u.dateOfBirth} onChange={(e) => updateUBO(i, { dateOfBirth: e.target.value })} /></FieldGroup>
                        <FieldGroup label="SIN"><input className={inputClass} placeholder="XXX-XXX-XXX" value={u.sin} onChange={(e) => updateUBO(i, { sin: e.target.value })} /></FieldGroup>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <FieldGroup label="Residential Address" className="col-span-1"><input className={inputClass} placeholder="City, Province" value={u.address} onChange={(e) => updateUBO(i, { address: e.target.value })} /></FieldGroup>
                        <FieldGroup label="Citizenship"><input className={inputClass} placeholder="e.g. Canadian" value={u.citizenship} onChange={(e) => updateUBO(i, { citizenship: e.target.value })} /></FieldGroup>
                        <FieldGroup label="% Ownership"><input className={`${inputClass} font-mono`} placeholder="50%" value={u.ownershipPercent} onChange={(e) => updateUBO(i, { ownershipPercent: e.target.value })} /></FieldGroup>
                      </div>
                      <FieldGroup label="Is this person a Politically Exposed Person (PEP) or Head of International Organization (HIO)?">
                        <YesNoButtons value={u.isPEP} onChange={(v) => updateUBO(i, { isPEP: v })} />
                      </FieldGroup>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PEP/HIO and Third-Party Payor */}
            <div className="space-y-4">
              <FieldGroup label="Is the insured or any owner a Politically Exposed Person (PEP) or Head of International Organization (HIO)?">
                <YesNoButtons value={data.pepHioDeclaration} onChange={(v) => updateData({ pepHioDeclaration: v })} />
              </FieldGroup>

              <FieldGroup label="Will the premiums be paid by a third party (someone other than the policy owner)?">
                <YesNoButtons value={data.thirdPartyPayorDeclaration} onChange={(v) => updateData({ thirdPartyPayorDeclaration: v })} />
              </FieldGroup>
              {data.thirdPartyPayorDeclaration === "Yes" && (
                <FieldGroup label="Third-Party Payor Name / Entity">
                  <input className={inputClass} placeholder="Name of the party paying premiums" value={data.thirdPartyPayorName} onChange={(e) => updateData({ thirdPartyPayorName: e.target.value })} />
                </FieldGroup>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
