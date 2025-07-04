import React from "react";

const SkeletonCard = () => (
  <div className="card mb-3 p-3">
    <div className="placeholder-glow mb-2">
      <span className="placeholder col-4 rounded"></span>
    </div>
    <div className="placeholder-glow">
      <span className="placeholder col-3 rounded"></span>
    </div>
  </div>
);

const SkeletonPagination = () => (
  <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
    {Array.from({ length: 13 }).map((_, i) => (
      <span
        key={i}
        className="placeholder col-1 rounded"
        style={{ height: "2rem", width: "2rem" }}
      ></span>
    ))}
  </div>
);

const TodoSkeleton = () => {
  return (
    <div className="">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
      <SkeletonPagination />
    </div>
  );
};

export default TodoSkeleton;
