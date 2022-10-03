import Param from './Param';

function SchemaForm(props) {
  const { params } = props;

  return (
    <div id="deployment-tab-data-form">
      {params.map((param, i) => {
        const id = `${param.path}-${i}`;

        return (
          <div key={id}>
            <Param {...props} param={param} id={id} />
          </div>
        );
      })}
    </div>
  );
}

export default SchemaForm;
