import { isArray } from 'lodash';

import { getYamlValue } from '.././../../utils';
import { Subsection, BooleanParam, TextParam, SliderParam } from './BasicForm';

export default function Param(props) {
  const {
    deploymentEvent,
    params,
    handleBasicFormParamChange,
    appValues,
    handleValuesChange,
    param,
    id
  } = props;

  const allParams = params;
  let paramComponent = <></>;
  const isObject = param.type === 'object';

  const isHidden = () => {
    const hidden = param.hidden;

    switch (typeof hidden) {
      case 'string':
        return evalCondition(hidden);

      case 'object':
        // Two type of supported objects
        // A single condition: {value: string, path: any}
        // An array of conditions: {conditions: Array<{value: string, path: any}, operator: string}
        if (hidden.conditions?.length > 0) {
          // If hidden is an object, a different logic should be applied based on the operator
          switch (hidden.operator) {
            case 'and':
              return hidden.conditions.every((c) =>
                evalCondition(c.path, c.value, c.event)
              );
            case 'or':
              return hidden.conditions.some((c) =>
                evalCondition(c.path, c.value, c.event)
              );
            case 'nor':
              return hidden.conditions.every(
                (c) => !evalCondition(c.path, c.value, c.event)
              );
            default:
              return hidden.conditions.every((c) =>
                evalCondition(c.path, c.value, c.event)
              );
          }
        } else {
          return evalCondition(hidden.path, hidden.value, hidden.event);
        }

      case 'undefined':
        return false;

      default:
        return false;
    }
  };

  const getParamMatchingPath = (params, path) => {
    let targetParam;
    for (const p of params) {
      if (p.path === path) {
        targetParam = p;
        break;
      } else if (p.children && p.children?.length > 0) {
        targetParam = getParamMatchingPath(p.children, path);
      }
    }
    return targetParam;
  };

  const evalCondition = (path, expectedValue, paramDeploymentEvent) => {
    if (paramDeploymentEvent == null) {
      let val = getYamlValue(appValues, path);
      if (val === undefined) {
        const target = getParamMatchingPath(allParams, path);
        val = target?.value;
      }
      return val === (expectedValue ?? true);
    } else {
      return paramDeploymentEvent === deploymentEvent;
    }
  };

  // Return early for custom components
  if (param.customComponent) {
    return (
      <div key={id} hidden={isHidden()}>
        CustomFormComponentLoader
        {/* <CustomFormComponentLoader
          param={param}
          handleBasicFormParamChange={handleBasicFormParamChange}
        /> */}
      </div>
    );
  }

  // If the type of the param is an array, represent it as its first type
  const type = isArray(param.type) ? param.type[0] : param.type;

  if (type === 'boolean') {
    paramComponent = (
      <BooleanParam
        label={param.title || param.path}
        id={id}
        param={param}
        handleBasicFormParamChange={handleBasicFormParamChange}
      />
    );
  } else if (type === 'object') {
    paramComponent = (
      <Subsection
        label={param.title || param.path}
        handleValuesChange={handleValuesChange}
        appValues={appValues}
        param={param}
        allParams={allParams}
        deploymentEvent={deploymentEvent}
      />
    );
  } else if (param.render === 'slider') {
    const p = param;
    paramComponent = (
      <SliderParam
        label={param.title || param.path}
        handleBasicFormParamChange={handleBasicFormParamChange}
        id={id}
        param={param}
        min={p.sliderMin || 1}
        max={p.sliderMax || 1000}
        step={p.sliderStep || 1}
        unit={p.sliderUnit || ''}
      />
    );
  } else if (param.render === 'textArea') {
    paramComponent = (
      <TextParam
        label={param.title || param.path}
        id={id}
        param={param}
        inputType="textarea"
        handleBasicFormParamChange={handleBasicFormParamChange}
      />
    );
  } else {
    const label = param.title || param.path;
    let inputType = 'string';

    if (type === 'integer') {
      inputType = 'number';
    }
    if (
      type === 'string' &&
      (param.render === 'password' || label.toLowerCase().includes('password'))
    ) {
      inputType = 'password';
    }
    paramComponent = (
      <TextParam
        label={label}
        id={id}
        param={param}
        inputType={inputType}
        handleBasicFormParamChange={handleBasicFormParamChange}
      />
    );
  }

  const isRenderStyled = !isObject && !isHidden();

  return (
    <div
      key={id}
      hidden={isHidden()}
      style={{
        padding: 15,
        marginBottom: isObject ? 15 : 10,
        paddingBottom: isRenderStyled ? 15 : 10,
        borderBottom: isRenderStyled && '1px solid #999',
        boxShadow: isObject && '1px 0 15px rgba(10,10,10,0.25)'
      }}
    >
      {/* <span style={{ color: 'red' }}>
        {param.render} / {param.type}
      </span> */}
      {paramComponent}
    </div>
  );
}
