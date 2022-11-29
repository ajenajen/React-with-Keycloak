import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HashLink as Link } from 'react-router-hash-link';

import { initSelected } from '../DeploymentPage/data';
import MainLayout from '../../layout/MainLayout';

function ReadMdPage() {
  const {
    availablePackageDetail: {
      name,
      repoUrl,
      homeUrl,
      iconUrl,
      shortDescription,
      readme
    }
  } = initSelected;
  const [description, setDestcription] = useState([]);

  useEffect(() => {
    setDestcription(readme.match(/^#+ [^#]*(?:#(?!#)[^#]*)*/gm));
  }, [readme]);

  return (
    <MainLayout>
      <div
        css={{
          display: 'flex',
          flexWrap: 'wrap',
          '.table': {
            borderSpacing: 0,
            borderCollapse: 'collapse',
            'th, td': {
              padding: '6px 13px',
              border: '1px solid #ccc'
            }
          }
        }}
      >
        <div
          css={{
            flex: '0 0 calc(25% - 30px)',
            paddingRight: 30,
            maxWidth: 'calc(25% - 30px)'
          }}
        >
          <h1 css={{ fontSize: '2em', marginBottom: 10 }}>
            <img
              css={{ width: 30, marginRight: 10 }}
              src={iconUrl}
              alt={iconUrl}
            />
            {name}
          </h1>
          <table className="table">
            <tr>
              <td>Repo URL</td>
              <td>{repoUrl}</td>
            </tr>
            <tr>
              <td>URL</td>
              <td>{homeUrl}</td>
            </tr>
            <tr>
              <td colSpan={2}>{shortDescription}</td>
            </tr>
          </table>
        </div>
        <div css={{ flex: '0 0 75%', maxWidth: '75%' }}>
          {description.map((paragraph, index) => (
            <div
              key={index}
              css={{
                background: '#eee',
                padding: 15,
                marginBottom: 15,
                borderRadius: 10
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: HeadingRenderer,
                  h2: HeadingRenderer,
                  h3: HeadingRenderer,
                  h4: HeadingRenderer,
                  h5: HeadingRenderer,
                  h6: HeadingRenderer,
                  a: LinkRenderer,
                  code: CodeRenderer,
                  table: TableRenderer,
                  p: ({ children }) => {
                    <div>{children}</div>;
                  }
                }}
                skipHtml={true}
              >
                {paragraph}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function HeadingRenderer(props) {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, '');
  const slug = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9_\s]/g, '') // remove punctuation
    .replace(/\s/g, '-'); // replace spaces with dash
  return React.createElement('h' + props.level, { id: slug }, props.children);
}

function LinkRenderer(props) {
  if (props.href.startsWith('#')) {
    return <Link to={props.href}>{props.children}</Link>;
  }
  return <a href={props.href}>{props.children}</a>;
}

function TableRenderer(props) {
  return <table className="table">{props.children}</table>;
}

function CodeRenderer(props) {
  return (
    <div
      style={{
        color: '#66d9ef',
        padding: 10,
        borderRadius: 10,
        background: '#333'
      }}
      dangerouslySetInnerHTML={{ __html: props.children }}
    />
  );
}

export default ReadMdPage;
