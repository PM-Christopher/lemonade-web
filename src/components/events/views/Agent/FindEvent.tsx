import React from "react";
import SearchIcon from "@/images/icons/search.svg";
import AgentEventCard from "@/components/events/AgentEventCard";
import Link from "next/link";

function FindEventSubMenu({ data, loading }: { data: any; loading: boolean }) {
  console.log("ise", data);
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] w-full">
        <div>
          <SearchIcon />
        </div>
        <div>
          <input
            id="search"
            type="text"
            className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent"
            placeholder="Search events..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 laptop:grid-cols-3 mt-[24px]">
        {data?.map((item: any, index: React.Key | null | undefined) => (
          <div key={index}>
            <Link href={`/event/${item.id}/agent-details`}>
              <AgentEventCard  image={item?.event_image} name={item?.event_name} amount={item?.minimum_price}  commission={item?.commission} />
            </Link>
          </div>
        ))}

        {/* <AgentEventCard />
                <AgentEventCard />
                <AgentEventCard />
                <AgentEventCard /> */}
      </div>
    </div>
  );
}

export default FindEventSubMenu;
