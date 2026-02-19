import { useDiscovery, Beneficiary } from "../DiscoveryContext";
import { Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

function FieldGroup({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

export function PersonalInfo() {
  const { data, updateData } = useDiscovery();

  const age = useMemo(() => {
    if (!data.dateOfBirth) return null;
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) a--;
    return a >= 0 ? a : null;
  }, [data.dateOfBirth]);

  const updateBeneficiary = (index: number, updates: Partial<Beneficiary>) => {
    const updated = data.beneficiaries.map((b, i) => (i === index ? { ...b, ...updates } : b));
    updateData({ beneficiaries: updated });
  };

  const addBeneficiary = () => {
    updateData({ beneficiaries: [...data.beneficiaries, { name: "", relationship: "", percentage: 0 }] });
  };

  const removeBeneficiary = (index: number) => {
    if (data.beneficiaries.length <= 1) return;
    updateData({ beneficiaries: data.beneficiaries.filter((_, i) => i !== index) });
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^0-9]/g, "");
    if (!num) return "";
    return Number(num).toLocaleString("en-US");
  };

  const maskSSN = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return digits.slice(0, 3) + "-" + digits.slice(3);
    return digits.slice(0, 3) + "-" + digits.slice(3, 5) + "-" + digits.slice(5);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">Basic client details and contact information.</p>
      </div>

      {/* Name */}
      <div className="grid grid-cols-3 gap-4">
        <FieldGroup label="First Name">
          <input className={inputClass} placeholder="First name" value={data.firstName} onChange={(e) => updateData({ firstName: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Middle Name">
          <input className={inputClass} placeholder="Middle name" value={data.middleName} onChange={(e) => updateData({ middleName: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Last Name">
          <input className={inputClass} placeholder="Last name" value={data.lastName} onChange={(e) => updateData({ lastName: e.target.value })} />
        </FieldGroup>
      </div>

      {/* DOB + SSN */}
      <div className="grid grid-cols-3 gap-4">
        <FieldGroup label="Date of Birth">
          <input type="date" className={inputClass} value={data.dateOfBirth} onChange={(e) => updateData({ dateOfBirth: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Age">
          <div className="flex h-[38px] items-center rounded-button border border-border bg-secondary/30 px-3 text-sm font-mono text-foreground">
            {age !== null ? `${age} years` : "—"}
          </div>
        </FieldGroup>
        <FieldGroup label="SSN">
          <input
            className={inputClass}
            placeholder="XXX-XX-XXXX"
            value={maskSSN(data.ssn)}
            onChange={(e) => updateData({ ssn: e.target.value.replace(/[^0-9]/g, "").slice(0, 9) })}
          />
        </FieldGroup>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <FieldGroup label="Street Address">
          <input className={inputClass} placeholder="123 Main St" value={data.street} onChange={(e) => updateData({ street: e.target.value })} />
        </FieldGroup>
        <div className="grid grid-cols-3 gap-4">
          <FieldGroup label="City">
            <input className={inputClass} placeholder="City" value={data.city} onChange={(e) => updateData({ city: e.target.value })} />
          </FieldGroup>
          <FieldGroup label="State">
            <select className={selectClass} value={data.state} onChange={(e) => updateData({ state: e.target.value })}>
              <option value="">Select</option>
              {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FieldGroup>
          <FieldGroup label="ZIP Code">
            <input className={inputClass} placeholder="12345" value={data.zip} onChange={(e) => updateData({ zip: e.target.value })} />
          </FieldGroup>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Phone">
          <input className={inputClass} placeholder="(555) 123-4567" value={data.phone} onChange={(e) => updateData({ phone: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Email">
          <input type="email" className={inputClass} placeholder="client@email.com" value={data.email} onChange={(e) => updateData({ email: e.target.value })} />
        </FieldGroup>
      </div>

      {/* Employment */}
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup label="Marital Status">
          <select className={selectClass} value={data.maritalStatus} onChange={(e) => updateData({ maritalStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
            <option value="Domestic Partner">Domestic Partner</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Employment Status">
          <select className={selectClass} value={data.employmentStatus} onChange={(e) => updateData({ employmentStatus: e.target.value })}>
            <option value="">Select</option>
            <option value="Employed">Employed</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Retired">Retired</option>
            <option value="Unemployed">Unemployed</option>
          </select>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FieldGroup label="Occupation">
          <input className={inputClass} placeholder="Occupation" value={data.occupation} onChange={(e) => updateData({ occupation: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Employer Name">
          <input className={inputClass} placeholder="Employer" value={data.employerName} onChange={(e) => updateData({ employerName: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Annual Household Income">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
            <input
              className={`${inputClass} pl-7 font-mono`}
              placeholder="100,000"
              value={formatCurrency(data.annualIncome)}
              onChange={(e) => updateData({ annualIncome: e.target.value.replace(/[^0-9]/g, "") })}
            />
          </div>
        </FieldGroup>
      </div>

      {/* Beneficiaries */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Beneficiaries</h3>
            <p className="text-xs text-muted-foreground">Designate one or more beneficiaries and allocation percentages.</p>
          </div>
          <button onClick={addBeneficiary} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
        <div className="space-y-3">
          {data.beneficiaries.map((b, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_100px_32px] gap-3 items-end">
              <FieldGroup label={i === 0 ? "Name" : ""}>
                <input className={inputClass} placeholder="Beneficiary name" value={b.name} onChange={(e) => updateBeneficiary(i, { name: e.target.value })} />
              </FieldGroup>
              <FieldGroup label={i === 0 ? "Relationship" : ""}>
                <select className={selectClass} value={b.relationship} onChange={(e) => updateBeneficiary(i, { relationship: e.target.value })}>
                  <option value="">Select</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Trust">Trust</option>
                  <option value="Other">Other</option>
                </select>
              </FieldGroup>
              <FieldGroup label={i === 0 ? "%" : ""}>
                <input
                  className={`${inputClass} font-mono text-center`}
                  placeholder="100"
                  value={b.percentage || ""}
                  onChange={(e) => updateBeneficiary(i, { percentage: Number(e.target.value.replace(/[^0-9]/g, "")) })}
                />
              </FieldGroup>
              <button
                onClick={() => removeBeneficiary(i)}
                disabled={data.beneficiaries.length <= 1}
                className="flex h-[38px] w-[32px] items-center justify-center rounded-button text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
