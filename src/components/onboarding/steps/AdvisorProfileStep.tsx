import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdvisorProfile } from "../OnboardingFlow";

const CA_PROVINCES = [
  "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador",
  "Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island",
  "Quebec","Saskatchewan","Yukon",
];

interface Props {
  profile: AdvisorProfile;
  onChange: (p: AdvisorProfile) => void;
  onBack: () => void;
  onNext: () => void;
}

export function AdvisorProfileStep({ profile, onChange, onBack, onNext }: Props) {
  const update = (field: keyof AdvisorProfile, value: string) =>
    onChange({ ...profile, [field]: value });

  const canContinue = profile.fullName.trim() && profile.email.trim();

  return (
    <div className="px-8 py-8">
      <h2 className="text-2xl font-bold text-foreground mb-1">About You</h2>
      <p className="text-muted-foreground text-sm mb-6">
        This information appears on your client presentations and handoff packages.
      </p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="e.g. John Smith"
            value={profile.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="agency">Agency / IMO Name</Label>
          <Input
            id="agency"
            placeholder="e.g. Pinnacle Financial Group"
            value={profile.agency}
            onChange={(e) => update("agency", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              value={profile.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@agency.com"
              value={profile.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="state">Province</Label>
          <Select value={profile.state} onValueChange={(v) => update("state", v)}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select province" />
            </SelectTrigger>
            <SelectContent>
              {CA_PROVINCES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="license">License Number</Label>
            <Input
              id="license"
              placeholder="e.g. 12345678"
              value={profile.licenseNumber}
              onChange={(e) => update("licenseNumber", e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="npn">National Producer Number (NPN)</Label>
            <Input
              id="npn"
              placeholder="e.g. 87654321"
              value={profile.npn}
              onChange={(e) => update("npn", e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Back
        </button>
        <Button onClick={onNext} disabled={!canContinue}>Continue</Button>
      </div>
    </div>
  );
}
