import { CalendarPlus } from "lucide-react";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";

// Empty state shared by the Upcoming, Past events and Draft tabs.
export function OrganizerEmpty({ message }: { message: string }) {
  const { push } = useNavigation();

  return (
    <div className="laptop:col-span-3 col-span-2 flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-light-green-60 flex h-20 w-20 items-center justify-center rounded-2xl">
        <CalendarPlus className="text-light-green h-10 w-10" />
      </div>
      <p className="text-body-l mt-4 font-sans font-semibold">List event</p>
      <p className="text-text-grey text-meta mt-1 max-w-72 font-sans">{message}</p>
      <button
        type="button"
        onClick={() => push(routes.EVENT_CREATE)}
        className="bg-gradient-green text-body-s mt-4 h-10 cursor-pointer rounded-xl px-8 font-sans font-medium text-white"
      >
        Add event
      </button>
    </div>
  );
}
