import { useState, useEffect } from 'react';
import { isNumber, isEmpty } from 'lodash';

export default function TextParam({
  id,
  param,
  label,
  inputType,
  handleBasicFormParamChange
}) {
  const [value, setValue] = useState(param.value || '');
  const [valueModified, setValueModified] = useState(false);
  const [timeout, setThisTimeout] = useState({});

  const onChange = (e) => {
    setValue(e.currentTarget.value);
    setValueModified(true);

    // Gather changes before submitting
    clearTimeout(timeout);

    const func = handleBasicFormParamChange(param);
    const targetCopy = {
      currentTarget: {
        value: e.currentTarget.value,
        type: e.currentTarget.type
      }
    };
    setThisTimeout(setTimeout(() => func(targetCopy), 500));
  };

  useEffect(() => {
    if (isNumber(param.value) || !isEmpty(param.value)) {
      //&& !valueModified
      setValue(param.value);
    }
  }, [param.value]); //valueModified

  let input = (
    <input
      id={id}
      onChange={onChange}
      value={value}
      type={inputType ? inputType : 'text'}
    />
  );

  if (inputType === 'textarea') {
    input = <textarea id={id} onChange={onChange} value={value} />;
  } else if (param.enum != null && param.enum?.length > 0) {
    input = (
      <select
        id={id}
        onChange={handleBasicFormParamChange(param)}
        value={param.value}
      >
        {param.enum.map((enumValue) => (
          <option key={enumValue}>{enumValue}</option>
        ))}
      </select>
    );
  }
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {input}
      {param.description && (
        <span className="description">{param.description}</span>
      )}
    </div>
  );
}
