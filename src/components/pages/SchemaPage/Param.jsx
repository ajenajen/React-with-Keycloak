import { useState, useEffect } from 'react';
import { isArray, isNumber, isEmpty } from 'lodash';
import { getValue, setValue, getValueFromEvent } from './utils';

import Switch from 'react-switch';
import {
  Handles,
  Rail,
  Slider as ReactSlider,
  Tracks
} from 'react-compound-slider';

const sliderStyle = {
  margin: '1.2em',
  position: 'relative',
  width: '90%'
};

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 14,
  borderRadius: 7,
  cursor: 'pointer',
  backgroundColor: 'rgb(155,155,155)'
};

export default function Param({
  appValues,
  param,
  allParams,
  id,
  handleBasicFormParamChange,
  handleValuesChange,
  deploymentEvent
}) {
  let paramComponent = <></>;

  const isHidden = () => {
    const hidden = param.hidden;
    // switch (typeof hidden) {
    //   case 'string':
    //     // If hidden is a string, it points to the value that should be true
    //     return evalCondition(hidden);
    //   case 'object':
    //     // Two type of supported objects
    //     // A single condition: {value: string, path: any}
    //     // An array of conditions: {conditions: Array<{value: string, path: any}, operator: string}
    //     if (hidden.conditions?.length > 0) {
    //       // If hidden is an object, a different logic should be applied
    //       // based on the operator
    //       switch (hidden.operator) {
    //         case 'and':
    //           // Every value matches the referenced
    //           // value (via jsonpath) in all the conditions
    //           return hidden.conditions.every((c) =>
    //             evalCondition(c.path, c.value, c.event)
    //           );
    //         case 'or':
    //           // It is enough if the value matches the referenced
    //           // value (via jsonpath) in any of the conditions
    //           return hidden.conditions.some((c) =>
    //             evalCondition(c.path, c.value, c.event)
    //           );
    //         case 'nor':
    //           // Every value mismatches the referenced
    //           // value (via jsonpath) in any of the conditions
    //           return hidden.conditions.every(
    //             (c) => !evalCondition(c.path, c.value, c.event)
    //           );
    //         default:
    //           // we consider 'and' as the default operator
    //           return hidden.conditions.every((c) =>
    //             evalCondition(c.path, c.value, c.event)
    //           );
    //       }
    //     } else {
    //       return evalCondition(hidden.path, hidden.value, hidden.event);
    //     }
    //   case 'undefined':
    //     return false;
    // }

    return hidden;
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
      let val = getValue(appValues, path);
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
        // handleBasicFormParamChange={handleBasicFormParamChange}
        id={id}
        param={param}
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
        // handleBasicFormParamChange={handleBasicFormParamChange}
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
        // handleBasicFormParamChange={handleBasicFormParamChange}
        id={id}
        param={param}
        inputType="textarea"
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
        // handleBasicFormParamChange={handleBasicFormParamChange}
        id={id}
        param={param}
        inputType={inputType}
      />
    );
  }

  return (
    <div key={id} hidden={isHidden()} className="basic-deployment-form-param">
      {paramComponent}
    </div>
  );
}

function BooleanParam({ id, param, label, handleBasicFormParamChange }) {
  // handleChange transform the event received by the Switch component to a checkbox event
  const handleChange = (checked) => {
    const event = {
      currentTarget: { value: String(checked), type: 'checkbox', checked }
    };
    // handleBasicFormParamChange(param)(event);
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

function Subsection({
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
      handleValuesChange(setValue(appValues, childrenParam.path, value));
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
              // handleBasicFormParamChange={handleChildrenParamChange}
              deploymentEvent={deploymentEvent}
              appValues={appValues}
              handleValuesChange={handleValuesChange}
            />
          );
        })}
    </div>
  );
}

function toNumber(value) {
  // Force to return a Number from a string removing any character that is not a digit
  return typeof value === 'number'
    ? value
    : Number(value.replace(/[^\d.]/g, ''));
}

function getDefaultValue(min, value) {
  return (value && toNumber(value)) || min;
}

function SliderParam({
  id,
  label,
  param,
  unit,
  step,
  min,
  max,
  handleBasicFormParamChange
}) {
  const domain = [min, max];
  const [value, setValue] = useState(getDefaultValue(min, param.value));

  useEffect(() => {
    setValue(getDefaultValue(min, param.value));
  }, [param, min]);

  const handleParamChange = (newValue) => {
    // handleBasicFormParamChange(param)({
    //   currentTarget: {
    //     value: param.type === 'string' ? `${newValue}${unit}` : newValue
    //   }
    // });
  };

  // onChangeSlider is run when the slider is dropped at one point
  // at that point we update the parameter
  const onChangeSlider = (values) => {
    handleParamChange(values[0]);
  };

  // onUpdateSlider is run when dragging the slider
  // we just update the state here for a faster response
  const onUpdateSlider = (values) => {
    setValue(values[0]);
  };

  const onChangeInput = (e) => {
    const numberValue = toNumber(e.currentTarget.value);
    setValue(numberValue);
    handleParamChange(numberValue);
  };

  return (
    <div>
      <label htmlFor={id}>
        <span className="centered deployment-form-label deployment-form-label-text-param">
          {label}
        </span>
        <div className="slider-block">
          <div className="slider-content">
            <ReactSlider
              mode={1}
              step={step || 1}
              domain={domain}
              rootStyle={{
                width: '100%',
                margin: '1.2em 0 1.2em 0'
              }}
              onUpdate={onUpdateSlider}
              onChange={onChangeSlider}
              values={[value]}
            >
              <Rail>
                {({ getRailProps }) => (
                  <div style={railStyle} {...getRailProps()} />
                )}
              </Rail>
              <Handles>
                {({ handles, getHandleProps }) => (
                  <div className="slider-handles">
                    {handles.map((handle) => (
                      <Handle
                        key={handle.id}
                        handle={handle}
                        domain={domain}
                        getHandleProps={getHandleProps}
                      />
                    ))}
                  </div>
                )}
              </Handles>
              <Tracks right={false}>
                {({ tracks, getTrackProps }) => (
                  <div className="slider-tracks">
                    {tracks.map(({ id, source, target }) => (
                      <Track
                        key={id}
                        source={source}
                        target={target}
                        getTrackProps={getTrackProps}
                      />
                    ))}
                  </div>
                )}
              </Tracks>
            </ReactSlider>
          </div>
          <div className="slider-input-and-unit">
            <input
              className="slider-input clr-input"
              id={id}
              onChange={onChangeInput}
              value={value}
            />
            <span className="margin-l-normal">{unit}</span>
          </div>
        </div>
        {param.description && (
          <span className="description">{param.description}</span>
        )}
      </label>
    </div>
  );
}

function TextParam({
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
    // const func = handleBasicFormParamChange(param);
    // The reference to target get lost, so we need to keep a copy
    const targetCopy = {
      currentTarget: {
        value: e.currentTarget.value,
        type: e.currentTarget.type
      }
    };
    // setThisTimeout(setTimeout(() => func(targetCopy), 500));
  };

  useEffect(() => {
    if ((isNumber(param.value) || !isEmpty(param.value)) && !valueModified) {
      setValue(param.value);
    }
  }, [valueModified, param.value]);

  let input = (
    <input
      id={id}
      onChange={onChange}
      value={value}
      className="clr-input deployment-form-text-input"
      type={inputType ? inputType : 'text'}
    />
  );
  if (inputType === 'textarea') {
    input = <textarea id={id} onChange={onChange} value={value} />;
  } else if (param.enum != null && param.enum?.length > 0) {
    input = (
      <select
        id={id}
        // onChange={handleBasicFormParamChange(param)}
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
      <label
        htmlFor={id}
        className="centered deployment-form-label deployment-form-label-text-param"
      >
        {label}
      </label>
      {input}
      {param.description && (
        <span className="description">{param.description}</span>
      )}
    </div>
  );
}

/* eslint-disable react/prop-types */
export const Handle = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps
}) => (
  <div
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    style={{
      left: `${percent}%`,
      position: 'absolute',
      marginLeft: '-11px',
      marginTop: '-6px',
      zIndex: 2,
      width: 24,
      height: 24,
      cursor: 'pointer',
      borderRadius: '50%',
      boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#34568f'
    }}
    {...getHandleProps(id)}
  />
);

// *******************************************************
// TRACK COMPONENT
// *******************************************************

export const Track = ({ source, target, getTrackProps }) => (
  <div
    style={{
      position: 'absolute',
      height: 14,
      zIndex: 1,
      backgroundColor: '#7aa0c4',
      borderRadius: 7,
      cursor: 'pointer',
      left: `${source.percent}%`,
      width: `${target.percent - source.percent}%`
    }}
    {...getTrackProps()}
  />
);
