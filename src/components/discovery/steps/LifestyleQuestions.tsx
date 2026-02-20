import { useDiscovery, AlcoholDetail } from "../DiscoveryContext";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

const inputClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass = "w-full rounded-button border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

function YesNoButtons({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {["Yes", "No"].map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-button px-5 py-2 text-sm font-medium border transition-colors",
            value === opt
              ? "border-primary bg-primary/15 text-primary"
              : "border-border text-muted-foreground hover:border-primary/50"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Question({ label, value, onChange, children, error, id }: { label: string; value: string; onChange: (v: string) => void; children?: React.ReactNode; error?: boolean; id?: string }) {
  return (
    <div id={id} className={cn("space-y-2 py-4 border-b border-border/40 last:border-0 rounded-lg transition-colors", error && "ring-1 ring-destructive/40 bg-destructive/5 px-3 -mx-3")}>
      <p className={cn("text-sm leading-relaxed", error ? "text-destructive font-medium" : "text-foreground")}>
        {label}
        {error && <span className="ml-1 text-xs font-normal text-destructive/70">— required</span>}
      </p>
      <YesNoButtons value={value} onChange={onChange} />
      {value === "Yes" && children && (
        <div className="mt-3 pl-2 border-l-2 border-primary/30">
          {children}
        </div>
      )}
    </div>
  );
}

export function LifestyleQuestions() {
  const { data, updateData, highlightMissing } = useDiscovery();
  const err = (val: string) => highlightMissing && !val;

  const updateAlcoholDetail = (index: number, updates: Partial<AlcoholDetail>) => {
    const updated = data.alcoholDetails.map((d, i) => (i === index ? { ...d, ...updates } : d));
    updateData({ alcoholDetails: updated });
  };
  const addAlcoholDetail = () => {
    updateData({ alcoholDetails: [...data.alcoholDetails, { product: "", amount: "", frequency: "" }] });
  };
  const removeAlcoholDetail = (index: number) => {
    if (data.alcoholDetails.length <= 1) return;
    updateData({ alcoholDetails: data.alcoholDetails.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Lifestyle & Underwriting</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          These questions are required by all carriers as part of the insurance application. Read each question to the client and record their answer accurately.
        </p>
      </div>

      {/* Travel & Activities */}
      <div className="rounded-card border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Travel & Activities</h3>

        <Question
          id="field-travelOutsideNA"
          error={err(data.travelOutsideNA)}
          label="Do you intend to travel outside of North America for longer than a total of 2 months, or change your country of residence, in the next 12 months?"
          value={data.travelOutsideNA}
          onChange={(v) => updateData({ travelOutsideNA: v })}
        />

        <Question
          id="field-aviationActivity"
          error={err(data.aviationActivity)}
          label="In the last 2 years have you flown in an aircraft as a pilot, student pilot, or crew member, or do you intend to do so in the next 12 months?"
          value={data.aviationActivity}
          onChange={(v) => updateData({ aviationActivity: v })}
        />

        <Question
          id="field-hazardousSports"
          error={err(data.hazardousSports)}
          label="In the last 2 years have you engaged in, or do you intend to engage in, any hazardous sports or activities including but not limited to: motorized racing, scuba diving, sky diving, bungee jumping, base jumping, hang gliding, mountain climbing, or heli/cat skiing?"
          value={data.hazardousSports}
          onChange={(v) => updateData({ hazardousSports: v })}
        />
      </div>

      {/* Driving & Criminal History */}
      <div className="rounded-card border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Driving & Legal History</h3>

        <Question
          id="field-duiConviction"
          error={err(data.duiConviction)}
          label="Have you been charged with, or convicted of, driving under the influence of alcohol and/or drugs, or refused to provide a breathalyzer sample, in the last 10 years?"
          value={data.duiConviction}
          onChange={(v) => updateData({ duiConviction: v })}
        />

        <Question
          id="field-drivingOffences"
          error={err(data.drivingOffences)}
          label="Within the last 3 years, have you been charged or convicted of any other driving offences (excluding parking tickets), or have you had your driver's licence suspended or revoked?"
          value={data.drivingOffences}
          onChange={(v) => updateData({ drivingOffences: v })}
        />

        <Question
          id="field-criminalOffence"
          error={err(data.criminalOffence)}
          label="Have you ever been charged with, convicted of, or pled guilty to any criminal offence or financial services regulatory offence (including securities regulators), or are any charges pending?"
          value={data.criminalOffence}
          onChange={(v) => updateData({ criminalOffence: v })}
        />
      </div>

      {/* Substance Use */}
      <div className="rounded-card border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Substance Use</h3>

        <Question
          id="field-tobaccoUse"
          error={err(data.tobaccoUse)}
          label="Have you smoked any cigarettes or used any other tobacco or nicotine-based products, or smoking cessation aids, within the last 12 months?"
          value={data.tobaccoUse}
          onChange={(v) => updateData({ tobaccoUse: v })}
        />

        <Question
          id="field-cannabisUse"
          error={err(data.cannabisUse)}
          label="Have you used any form of marijuana or hashish within the last 5 years?"
          value={data.cannabisUse}
          onChange={(v) => updateData({ cannabisUse: v })}
        />

        <Question
          id="field-drugUse"
          error={err(data.drugUse)}
          label="Have you ever used unprescribed drugs or experimented with drugs or narcotics such as ecstasy, cocaine, LSD, heroin, amphetamines, barbiturates, anabolic steroids, or similar agents?"
          value={data.drugUse}
          onChange={(v) => updateData({ drugUse: v })}
        />
      </div>

      {/* Alcohol */}
      <div className="rounded-card border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1">Alcohol</h3>

        <Question
          id="field-alcoholUse"
          error={err(data.alcoholUse)}
          label="Do you drink alcohol?"
          value={data.alcoholUse}
          onChange={(v) => updateData({ alcoholUse: v })}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Please specify product, amount consumed, and frequency.</p>
              <button onClick={addAlcoholDetail} className="flex items-center gap-1.5 rounded-button border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {data.alcoholDetails.map((d, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-end">
                <div>
                  {i === 0 && <label className="mb-1 block text-xs text-muted-foreground">Product</label>}
                  <input className={inputClass} placeholder="Beer, Wine, Spirits…" value={d.product} onChange={(e) => updateAlcoholDetail(i, { product: e.target.value })} />
                </div>
                <div>
                  {i === 0 && <label className="mb-1 block text-xs text-muted-foreground">Amount</label>}
                  <input className={inputClass} placeholder="e.g. 4 bottles" value={d.amount} onChange={(e) => updateAlcoholDetail(i, { amount: e.target.value })} />
                </div>
                <div>
                  {i === 0 && <label className="mb-1 block text-xs text-muted-foreground">Frequency</label>}
                  <select className={selectClass} value={d.frequency} onChange={(e) => updateAlcoholDetail(i, { frequency: e.target.value })}>
                    <option value="">Select</option>
                    <option value="Per Day">Per Day</option>
                    <option value="Per Week">Per Week</option>
                    <option value="Per Month">Per Month</option>
                  </select>
                </div>
                <button
                  onClick={() => removeAlcoholDetail(i)}
                  disabled={data.alcoholDetails.length <= 1}
                  className="flex h-[38px] w-[32px] items-center justify-center rounded-button text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Question>

        <Question
          label="Have you ever been treated or counselled for alcohol consumption or abuse, or has someone ever recommended that you seek treatment or counselling for alcohol consumption?"
          value={data.alcoholCounselling}
          onChange={(v) => updateData({ alcoholCounselling: v })}
        />
      </div>
    </div>
  );
}
