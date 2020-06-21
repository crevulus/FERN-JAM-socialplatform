import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

// children = w/e is inside, usu. icon
export default ({ children, onClick, tip, btnClassName, tipClassName }) => (
  <Tooltip title={tip} className={tipClassName}>
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  </Tooltip>
);
