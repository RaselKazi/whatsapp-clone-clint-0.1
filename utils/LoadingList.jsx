import React from "react";

export default function LoadingList({ item }) {
  return (
    <div>
      {Array(item)
        .fill(0)
        .map((_, index) => (
          <div className=" shadow  p-4 w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-700 h-8 w-8"></div>
              <div className="flex-1 py-1">
                <div className="space-y-3">
                  <div className="h-2 bg-slate-700 rounded"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
