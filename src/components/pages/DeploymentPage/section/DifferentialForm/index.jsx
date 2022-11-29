import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

function DifferentialForm({
  deploymentEvent,
  deployedValues,
  defaultValues,
  appValues
}) {
  let oldValues = '';
  let emptyDiffElement = <></>;

  if (deploymentEvent === 'upgrade') {
    oldValues = deployedValues;
    emptyDiffElement = (
      <span>
        <p>
          The values you have entered to upgrade this package with are identical
          to the currently deployed ones.
        </p>
        <p>
          If you want to restore the default values provided by the package,
          click on the <i>Restore defaults</i> button below.
        </p>
      </span>
    );
  } else {
    oldValues = defaultValues || '';
    emptyDiffElement = (
      <span>No changes detected from the package defaults.</span>
    );
  }

  const newStyles = {
    variables: {
      dark: {
        // gutter
        gutterColor: '#d0edf7',
        gutterBackground: '#01313f',
        gutterBackgroundDark: '#01313f',
        addedGutterColor: '#d0edf7',
        removedGutterColor: '#d0edf7',
        // background
        diffViewerBackground: '#002B36',
        emptyLineBackground: '#002B36',
        // fold text
        codeFoldContentColor: 'white'
      }
    }
  };

  return (
    <div>
      {oldValues === appValues ? (
        emptyDiffElement
      ) : (
        <ReactDiffViewer
          oldValue={oldValues}
          newValue={appValues}
          splitView={false}
          useDarkTheme={true}
          compareMethod={DiffMethod.WORDS}
          styles={newStyles}
        />
      )}
    </div>
  );
}

export default DifferentialForm;
