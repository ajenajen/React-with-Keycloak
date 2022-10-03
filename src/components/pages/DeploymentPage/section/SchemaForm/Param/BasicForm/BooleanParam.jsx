import Switch from 'react-switch';

export default function BooleanParam({
  id,
  param,
  label,
  handleBasicFormParamChange
}) {
  const handleChange = (checked) => {
    const event = {
      currentTarget: { value: String(checked), type: 'checkbox', checked }
    };
    handleBasicFormParamChange(param)(event);
  };

  return (
    <label htmlFor={id}>
      <div>
        <Switch
          height={20}
          width={40}
          id={id}
          onChange={handleChange}
          checked={!!param.value}
          className="react-switch"
          onColor="#5aa220"
          checkedIcon={false}
          uncheckedIcon={false}
        />
        <span className="deployment-form-label">{label}</span>
      </div>
      {param.description && (
        <span className="description">{param.description}</span>
      )}
    </label>
  );
}
