/** @jsxImportSource @emotion/react */

export default function Header() {
  return (
    <div
      css={{
        display: 'flex',
        width: '100%',
        height: 70,
        // borderRadius: '0px 0px 12px 12px',
        background: '#2f2f2f'
      }}
    >
      <div css={{ padding: 15 }}>
        <img src="/themes/main/logo.svg" alt="logo" />
      </div>
    </div>
  );
}
