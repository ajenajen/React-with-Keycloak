import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';

function YamlForm({ appValues, handleValuesChange }) {
  let timeout;
  const onChange = (value) => {
    // Gather changes before submitting
    clearTimeout(timeout);
    timeout = setTimeout(() => handleValuesChange(value), 500);
  };

  return (
    <AceEditor
      mode="yaml"
      theme={'monokai'}
      width="100%"
      height="700px"
      onChange={onChange}
      setOptions={{
        useWorker: false,
        showPrintMargin: false,
        showLineNumbers: true,
        tabSize: 2
      }}
      value={appValues}
      className="editor"
      fontSize="13px"
    />
  );
}

export default YamlForm;
