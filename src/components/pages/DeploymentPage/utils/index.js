import * as jsonpatch from 'fast-json-patch';
import { isEmpty, set } from 'lodash';
import YAML, { Scalar } from 'yaml';

const toStringOptions = {
  defaultKeyType: 'PLAIN',
  defaultStringType: Scalar.QUOTE_DOUBLE,
  nullStr: ''
};

export function retrieveBasicFormParams(defaultValues, schema, parentPath) {
  let params = [];

  if (schema && schema.properties) {
    const properties = schema.properties;

    Object.keys(properties).map((propertyKey) => {
      const itemPath = `${parentPath || ''}${propertyKey}`;
      const { type, form } = properties[propertyKey];
      if (form) {
        const value = getYamlValue(
          defaultValues,
          itemPath,
          properties[propertyKey].default
        );

        const param = {
          ...properties[propertyKey],
          path: itemPath,
          type,
          value,
          enum: properties[propertyKey].enum?.map(
            (item) => item?.toString() ?? ''
          ),
          children:
            properties[propertyKey].type === 'object'
              ? retrieveBasicFormParams(
                  defaultValues,
                  properties[propertyKey],
                  `${itemPath}/`
                )
              : undefined
        };
        params = params.concat(param);
      } else {
        // If the property is an object, iterate recursively
        if (schema.properties[propertyKey].type === 'object') {
          params = params.concat(
            retrieveBasicFormParams(
              defaultValues,
              properties[propertyKey],
              `${itemPath}/`
            )
          );
        }
      }
      return false;
    });
  }

  return params;
}

export function parseValues(values) {
  return YAML.parseDocument(values, toStringOptions).toString(toStringOptions);
}

function splitPath(path) {
  return (
    (path ?? '')
      // ignore the first slash, if exists
      .replace(/^\//, '')
      // split by slashes
      .split('/')
  );
}

function unescapePath(path) {
  // jsonpath escapes slashes to not mistake then with objects so we need to revert that
  return path.map((p) => jsonpatch.unescapePathComponent(p));
}

function parsePath(path) {
  return unescapePath(splitPath(path));
}

function getDefinedPath(allElementsButTheLast, doc) {
  let currentPath = [];
  let foundUndefined = false;
  allElementsButTheLast.forEach((p) => {
    // Iterate over the path until finding an element that is not defined
    if (!foundUndefined) {
      const pathToEvaluate = currentPath.concat(p);
      const elem = doc.getIn(pathToEvaluate);
      if (elem === undefined || elem === null) {
        foundUndefined = true;
      } else {
        currentPath = pathToEvaluate;
      }
    }
  });
  return currentPath;
}

function parsePathAndValue(doc, path, value) {
  if (isEmpty(doc.contents)) {
    // If the doc is empty we have an special case
    return { value: set({}, path.replace(/^\//, ''), value), splittedPath: [] };
  }
  let splittedPath = splitPath(path);
  const allElementsButTheLast = splittedPath?.slice(
    0,
    splittedPath?.length - 1
  );

  const parentNode = doc.getIn(allElementsButTheLast);

  if (parentNode === undefined) {
    const definedPath = getDefinedPath(allElementsButTheLast, doc);
    const remainingPath = splittedPath?.slice(definedPath?.length + 1);
    value = set({}, remainingPath.join('.'), value);
    splittedPath = splittedPath?.slice(0, definedPath?.length + 1);
  }
  return { splittedPath: unescapePath(splittedPath), value };
}

export function getYamlValue(values, path, defaultValue) {
  const doc = YAML.parseDocument(values, toStringOptions);
  const splittedPath = parsePath(path);
  const value = doc.getIn(splittedPath);

  return value === undefined || value === null ? defaultValue : value;
}

export function setYamlValue(values, path, newValue) {
  const doc = YAML.parseDocument(values, toStringOptions);
  const { splittedPath, value } = parsePathAndValue(doc, path, newValue);
  doc.setIn(splittedPath, value);

  return doc.toString(toStringOptions);
}

export function getValueFromEvent(e) {
  let value = e.currentTarget.value;
  switch (e.currentTarget.type) {
    case 'checkbox':
      // value is a boolean
      value = value === 'true';
      break;
    case 'number':
      // value is a number
      value = parseInt(value, 10);
      break;
    default:
      return value;
  }
  return value;
}
