import React from "react";

export default ({ children }) => {
  return (
    <div className="modal display-block">
      <section className="modal-main">{children}</section>
    </div>
  );
};
