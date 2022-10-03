import { setYamlValue, getValueFromEvent } from '.././../../../utils';
import Param from '../../Param';

export default function Subsection({
  label,
  param,
  allParams,
  appValues,
  deploymentEvent,
  handleValuesChange
}) {
  const handleChildrenParamChange = (childrenParam) => {
    return (e) => {
      const value = getValueFromEvent(e);
      param.children = param.children.map((p) =>
        p.path === childrenParam.path ? { ...childrenParam, value } : p
      );
      handleValuesChange(setYamlValue(appValues, childrenParam.path, value));
    };
  };

  return (
    <div className="subsection">
      <div>
        <label className="deployment-form-label">{label}</label>
        {param.description && (
          <>
            <br />
            <span className="description">{param.description}</span>
          </>
        )}
      </div>
      {param.children &&
        param.children.map((childrenParam, i) => {
          const id = `${childrenParam.path}-${i}`;
          return (
            <Param
              param={childrenParam}
              allParams={allParams}
              id={id}
              key={id}
              handleBasicFormParamChange={handleChildrenParamChange}
              deploymentEvent={deploymentEvent}
              appValues={appValues}
              handleValuesChange={handleValuesChange}
            />
          );
        })}
    </div>
  );
}
