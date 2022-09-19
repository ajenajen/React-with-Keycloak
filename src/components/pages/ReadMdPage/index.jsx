import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { HashLink as Link } from 'react-router-hash-link';

import MockupData from './Readme.md';
import MainLayout from '../../layout/MainLayout';

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  .table {
    border-spacing: 0;
    border-collapse: collapse;
    th,
    td {
      padding: 6px 13px;
      border: 1px solid #ccc;
    }
  }
`;

function ReadMdPage() {
  const [description, setDestcription] = useState([]);

  useEffect(() => {
    fetch(MockupData)
      .then((res) => res.text())
      .then((text) =>
        setDestcription(text.match(/^#+ [^#]*(?:#(?!#)[^#]*)*/gm))
      );
  });

  return (
    <MainLayout>
      <Flex>
        <div style={{ flex: '0 0 30%' }}></div>
        <div style={{ flex: '0 0 70%' }}>
          {description.map((paragraph, index) => (
            <div
              key={index}
              style={{
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
                  table: TableRenderer
                }}
                skipHtml={true}
              >
                {paragraph}
              </ReactMarkdown>
            </div>
          ))}
        </div>
      </Flex>
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
  // const html = prismCodeHtml(props.value, props.language);

  return (
    <pre
      style={{
        color: '#66d9ef',
        padding: 10,
        borderRadius: 10,
        background: '#333'
      }}
    >
      {props.children}
      {/* <code dangerouslySetInnerHTML={{ __html: props.children }} /> */}
    </pre>
  );
}

export default ReadMdPage;
