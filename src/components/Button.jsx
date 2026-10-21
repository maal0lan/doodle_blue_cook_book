import React from "react";
import "./Button.css";

/**
 * Reusable Button component for retro pixel styling
 * @param {'primary' | 'submit' | 'pagination' | 'pagination-num' | 'logout' | 'close'} variant
 */
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "submit",
  disabled = false,
  className = "",
  style = {},
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
      case "add":
        return "btn-retro-primary";
      case "pagination":
        return "btn-retro-pagination";
      case "pagination-num":
        return "btn-retro-pagination-num";
      case "logout":
        return "btn-retro-logout";
      case "close":
        return "btn-retro-close";
      case "submit":
      default:
        return "btn-retro-submit";
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={`btn-retro ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
