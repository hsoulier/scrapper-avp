import { CheckCircleIcon } from "@heroicons/react/24/outline";

export const PillVersion = ({ version }: { version?: string }) => {
  if (!version) return null;
  if (version === "VF") {
    return (
      <span className="whitespace-nowrap rounded-full bg-purple-900 border border-purple-500 px-2 py-0.5 text-sm text-neutral-100 inline-flex items-center gap-1 justify-start">
        VF
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap rounded-full bg-amber-900 border border-amber-500 px-2 py-0.5 text-sm text-neutral-100 inline-flex items-center gap-1 justify-start">
      {version}
    </span>
  );
};

export const PillWithTeam = ({ infos }: { infos?: string }) => {
  if (!infos) return null;
  if (infos === "Avant-première avec équipe") {
    return (
      <span className="whitespace-nowrap rounded-full bg-emerald-900 border border-emerald-500 px-2 py-0.5 text-sm text-neutral-100 inline-flex items-center gap-1 justify-start">
        <CheckCircleIcon className="size-4 inline" />
        Avec l'équipe
      </span>
    );
  }

  return (
    <span className="whitespace-nowrap rounded-full bg-indigo-900 border border-indigo-500 px-2 py-0.5 text-sm text-neutral-100 inline-flex items-center gap-1 justify-start">
      Sans équipe
    </span>
  );
};
