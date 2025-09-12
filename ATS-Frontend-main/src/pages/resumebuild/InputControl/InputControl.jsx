const InputControl = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-medium text-base text-gray-700">{label}</label>}
      <input
        type="text"
        className="border border-gray-300 rounded-md px-3 py-2 text-base outline-none hover:border-gray-400 focus:border-blue-500 transition-colors"
        {...props}
      />
    </div>
  );
}

export default InputControl;