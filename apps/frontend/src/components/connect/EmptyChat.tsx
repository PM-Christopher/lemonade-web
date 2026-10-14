import React from "react";

const EmptyChat = () => {
  return (
    <div className="relative flex h-162 w-140 flex-col rounded-tr-2xl rounded-br-2xl border-t border-r border-b bg-white">
      <div className="absolute top-0 left-0 w-full rounded-tr-2xl p-2 text-white"></div>

      <div className="mb-16 flex h-screen items-center justify-center rounded-tr-2xl rounded-br-2xl bg-white p-4">
        <p className="font-ruso text-title-r leading-normal font-semibold">
          Open chat to begin messaging
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full rounded-br-2xl p-4 px-3.25 text-white"></div>
    </div>
  );
};

export default EmptyChat;
