import classNames from "classnames";
import React, { FC } from "react";

interface InputI {
  type: string;
  placeholder: string;
  value: string;
  setValue: (str: string) => void;
  error: undefined | string;
}

export default function Input({
  type,
  placeholder,
  error,
  value,
  setValue,
}: InputI) {
  // console.log(errors[value]);

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className={classNames(
          "w-full p-2 border-2 rounded outline-none bg-gray-50 hover:bg-white focus:bg-white",
          { "border-red-700": error }
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="block text-red-600">{error}</small>
    </>
  );
}
