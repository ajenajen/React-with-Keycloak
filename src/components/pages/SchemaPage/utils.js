import * as jsonpatch from 'fast-json-patch';
import * as yaml from 'js-yaml';
import { isEmpty, set } from 'lodash';
import YAML, { ToStringOptions, Scalar } from 'yaml';

export function retrieveBasicFormParams(defaultValues, schema, parentPath) {
  let params = [];

  if (schema && schema.properties) {
    const properties = schema.properties;

    Object.keys(properties).forEach((propertyKey) => {
      // The param path is its parent path + the object key
      const itemPath = `${parentPath || ''}${propertyKey}`;
      const { type, form } = properties[propertyKey];
      // If the property has the key "form", it's a basic parameter
      if (form) {
        // Use the default value either from the JSON schema or the default values
        const value = getValue(
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
    });
  }

  return params;
}

const toStringOptions = {
  defaultKeyType: 'PLAIN',
  defaultStringType: Scalar.QUOTE_DOUBLE, // Preserving double quotes in scalars (see https://github.com/vmware-tanzu/kubeapps/issues/3621)
  nullStr: '' // Avoid to explicitly add "null" when an element is not defined
};

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

// getValue returns the current value of an object based on YAML text and its path
export function getValue(values, path, defaultValue) {
  const doc = YAML.parseDocument(values, { toStringDefaults: toStringOptions });
  const splittedPath = parsePath(path);
  const value = doc.getIn(splittedPath);
  return value === undefined || value === null ? defaultValue : value;
}

export function setValue(values, path, newValue) {
  const doc = YAML.parseDocument(values, { toStringDefaults: toStringOptions });
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
  }
  return value;
}
