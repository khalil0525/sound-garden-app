import React from "react";
import styles from "./Button.module.css";
//     large
//
const Button = ({
  buttonSize = null,
  iconImage = null,
  altText = null,
  disabled = null,
  iconClasses = "",
  className,
  children,
  onClick,
}) => {
  // This will be returned if we get an image. We can either get an Icon or a string
  // That is a reference to the Image.
  if (iconImage) {
    return (
      <button
        className={`${styles[`btn-${buttonSize}`]} ${className} ${styles.btn}`}
        disabled={disabled}
        onClick={onClick}
      >
        {typeof iconImage === "string" ? (
          <img
            src={iconImage}
            alt={altText}
            className={`${styles[`icon-${buttonSize}`]} ${iconClasses}`}
          />
        ) : (
          // We are passing a Icon component as a function with (className) as it's
          // Parameters, so call the function to create the component with the classNames
          iconImage(`${styles[`icon-${buttonSize}`]} ${iconClasses}`)
        )}
        {children}
      </button>
    );
  } else {
    return (
      <button
        className={`${styles[`btn-${buttonSize}`]} ${className} ${styles.btn}`}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
};

export default Button;
