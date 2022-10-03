import { useState, useEffect } from 'react';
import { Handles, Rail, Slider as ReactSlider } from 'react-compound-slider';

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

const railStyle = {
  position: 'absolute',
  width: '100%',
  height: 14,
  borderRadius: 7,
  cursor: 'pointer',
  backgroundColor: 'rgb(155,155,155)'
};

export default function SliderParam({
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
    handleBasicFormParamChange(param)({
      currentTarget: {
        value: param.type === 'string' ? `${newValue}${unit}` : newValue
      }
    });
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
              {/* <Tracks right={false}>
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
              </Tracks> */}
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

function toNumber(value) {
  return typeof value === 'number'
    ? value
    : Number(value.replace(/[^\d.]/g, ''));
}

function getDefaultValue(min, value) {
  return (value && toNumber(value)) || min;
}
