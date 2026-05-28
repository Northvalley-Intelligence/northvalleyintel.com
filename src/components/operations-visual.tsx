import {
  CheckCircle2,
  ClipboardList,
  Database,
  MessageSquareText,
} from "lucide-react";

const timeline = [
  { label: "Inquiry captured", icon: MessageSquareText },
  { label: "Job qualified", icon: ClipboardList },
  { label: "Crew scheduled", icon: CheckCircle2 },
  { label: "Knowledge retained", icon: Database },
];

export function OperationsVisual() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-white/15 bg-[#182331] text-white shadow-[0_24px_70px_rgba(15,23,32,0.22)]"
      aria-label="Operational intelligence dashboard preview"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d46a4c]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7a947]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#4eaa75]" />
        <strong className="ml-auto text-xs text-[#d9e7ef]">
          Workflow Readiness
        </strong>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <Metric label="Lead Intake" value="84%" color="bg-north-teal" />
        <Metric label="Knowledge Access" value="61%" color="bg-north-amber" />

        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/8 p-4 sm:row-span-2">
          {timeline.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="grid grid-cols-[2.5rem_1fr] items-center gap-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-md bg-north-blue/45">
                  <Icon aria-hidden="true" size={18} />
                </div>
                <div>
                  <b className="text-xs text-[#91a8b7]">0{index + 1}</b>
                  <p className="m-0 text-sm text-[#e0e8ee]">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-white/10 bg-white/8 p-4">
          <span className="text-xs font-semibold text-[#b5c4cf]">
            Operational memory
          </span>
          <p className="mt-2 text-sm text-[#d9e7ef]">
            Customer preferences, service notes, crew context, and recurring
            work patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const width = value;

  return (
    <div className="rounded-lg border border-white/10 bg-white/8 p-4">
      <span className="text-xs font-semibold text-[#b5c4cf]">{label}</span>
      <strong className="my-2 block text-4xl leading-none">{value}</strong>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/12">
        <span
          className={`block h-full rounded-full ${color}`}
          style={{ width }}
        />
      </div>
    </div>
  );
}
