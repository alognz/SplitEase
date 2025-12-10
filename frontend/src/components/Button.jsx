import { Link } from "react-router-dom";

export default function Button({
  children,
  onClick,
  type = "button",
  width = "w-40",
  variant = "primary",
  to = null,
  center = false,
}) {
  const baseStyles =
    "h-11 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center hover:scale-105 active:scale-95"; 

  const variants = {
    primary: "bg-primary text-white hover:bg-[#4F7C7A]",
    secondary: "bg-accent text-white hover:bg-[#c49c63]",
    outline:
      "border border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
  };

  const classes =
    `${width} ${baseStyles} ${variants[variant]} ` +
    (center ? "mx-auto" : "");

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}